import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import DetectionCard from '../components/DetectionCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { subscribeToRecentTraps } from '../services/firestoreService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { formatTimeAgo, isDetected } from '../utils/helpers'

export default function Dashboard() {
  const [traps, setTraps] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, profile, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const name     = profile?.fullName || user?.displayName || user?.email?.split('@')[0] || 'User'
  const email    = user?.email || ''
  const role     = profile?.role || 'Farmer'
  const phone    = profile?.phone || ''
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  useEffect(() => {
    const unsub = subscribeToRecentTraps((data) => {
      setTraps(data)
      setLoading(false)
    }, 6)
    return unsub
  }, [])

  const totalDetected = traps.filter(isDetected).length
  const clearScans    = traps.length - totalDetected
  const activeTraps   = traps.filter((t) => t.active !== false).length
  const lastUpdated   = traps[0]?.timestamp

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully.')
    navigate('/login', { replace: true })
  }

  return (
    <Layout>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-2xl font-extrabold text-white flex-shrink-0 shadow-sm">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{name}</h2>
              <p className="text-sm text-gray-500">{email}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-100">
                  <div className="w-3 h-3"><ShieldIcon /></div>
                  {role}
                </span>
                {phone && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-3 h-3 text-gray-400"><PhoneIcon /></div>
                    {phone}
                  </span>
                )}
                {lastUpdated && (
                  <span className="text-xs text-gray-400">
                    Last update: {formatTimeAgo(lastUpdated)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/profile" className="btn-secondary text-sm flex items-center gap-1.5 py-1.5 px-3">
              <div className="w-4 h-4"><EditIcon /></div>
              Edit Profile
            </Link>
            <button onClick={handleLogout} className="btn-danger text-sm flex items-center gap-1.5 py-1.5 px-3">
              <div className="w-4 h-4"><LogoutIcon /></div>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Plantation Overview */}
      <div className="mb-3">
        <h2 className="section-title">Plantation Overview</h2>
        <p className="text-xs text-gray-400 mt-0.5 mb-4">Real-time summary of your detection system</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Traps"  value={loading ? '…' : traps.length}  icon={<TrapIcon />}   bgClass="bg-blue-50"    colorClass="text-blue-600" />
        <StatCard label="Active Traps" value={loading ? '…' : activeTraps}   icon={<SignalIcon />}  bgClass="bg-purple-50"  colorClass="text-purple-600" />
        <StatCard label="RPW Alerts"   value={loading ? '…' : totalDetected} icon={<AlertIcon />}  bgClass="bg-red-50"     colorClass="text-red-500" />
        <StatCard label="Clear Scans"  value={loading ? '…' : clearScans}    icon={<CheckIcon />}  bgClass="bg-emerald-50" colorClass="text-emerald-600" />
      </div>

      {/* RPW Alert Banner */}
      {!loading && totalDetected > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
          <div className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"><AlertIcon /></div>
          <div>
            <p className="font-semibold text-red-800">Red Palm Weevil Detected</p>
            <p className="text-sm text-red-600 mt-0.5">
              {totalDetected} detection{totalDetected > 1 ? 's' : ''} found. Check Trap Details for full information and images.
            </p>
          </div>
        </div>
      )}

      {/* Recent Detections */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="section-title">Recent Detection Images</h2>
          <p className="text-xs text-gray-400 mt-0.5">Latest trap scan results</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <span className="pulse-dot" />
          <span className="text-xs text-emerald-700 font-semibold">Live</span>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching detections..." />
      ) : traps.length === 0 ? (
        <EmptyState title="No detections yet" message="Detection results from your Python YOLO script will appear here in real-time." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {traps.map((trap) => (
            <DetectionCard key={trap.id} detection={trap} />
          ))}
        </div>
      )}

      {/* Notifications */}
      <div className="mt-8">
        <h2 className="section-title mb-4 flex items-center gap-2">
          <div className="w-4 h-4 text-gray-600"><BellIcon /></div>
          Notifications
        </h2>
        {totalDetected > 0 ? (
          <div className="space-y-3">
            {traps.filter(isDetected).slice(0, 3).map((trap) => (
              <div key={trap.id} className="card-flat flex items-center gap-3 p-4 border-l-4 border-l-red-400">
                <div className="w-5 h-5 text-red-500 flex-shrink-0"><AlertIcon /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">RPW Detected — {trap.trapId}</p>
                  <p className="text-xs text-gray-500">{trap.location || 'Unknown location'} · {formatTimeAgo(trap.timestamp)}</p>
                </div>
                {trap.confidence != null && (
                  <span className="text-xs font-bold text-red-600 flex-shrink-0">{trap.confidence}%</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card-flat flex items-center gap-3 p-4">
            <div className="w-5 h-5 text-green-500 flex-shrink-0"><CheckIcon /></div>
            <p className="text-sm text-gray-500">No new notifications. All traps are clear.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

const ShieldIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const PhoneIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const EditIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const LogoutIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const TrapIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
const SignalIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="1" y1="20" x2="1" y2="14"/><line x1="6" y1="20" x2="6" y2="10"/><line x1="11" y1="20" x2="11" y2="4"/><line x1="16" y1="20" x2="16" y2="8"/><line x1="21" y1="20" x2="21" y2="2"/></svg>
const AlertIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const CheckIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="20 6 9 17 4 12"/></svg>
const BellIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
