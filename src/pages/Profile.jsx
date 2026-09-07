import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { doc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { db, auth } from '../firebase/firebase'
import { formatDate } from '../utils/helpers'

export default function Profile() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    setFullName(profile?.fullName || user?.displayName || '')
    setPhone(profile?.phone || '')
  }, [profile, user])

  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U'

  const handleSave = async () => {
    if (!fullName.trim()) return toast.error('Full name is required.')
    setSaving(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), { fullName: fullName.trim(), phone: phone.trim() })
      await updateProfile(auth.currentUser, { displayName: fullName.trim() })
      toast.success('Profile updated successfully.')
      setEditing(false)
    } catch {
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">View and manage your account information</p>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Avatar card */}
        <div className="card flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-3xl font-extrabold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-gray-900 truncate">{fullName || 'No name set'}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-100">
              <div className="w-3 h-3"><ShieldIcon /></div>
              {profile?.role || 'Farmer'}
            </span>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="btn-secondary text-sm flex-shrink-0 flex items-center gap-2"
          >
            <div className="w-4 h-4">{editing ? <XIcon /> : <EditIcon />}</div>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Info card */}
        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-4 h-4 text-primary-600"><UserIcon /></div>
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  className="input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900 py-2">{fullName || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
              {editing ? (
                <input
                  type="tel"
                  className="input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                />
              ) : (
                <p className="text-sm font-medium text-gray-900 py-2">{profile?.phone || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
              <p className="text-sm font-medium text-gray-900 py-2">{user?.email}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
              <p className="text-sm font-medium text-gray-900 py-2">{profile?.role || 'Farmer'}</p>
            </div>
          </div>

          {editing && (
            <button onClick={handleSave} disabled={saving}
              className="btn-primary flex items-center gap-2 px-6">
              {saving
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                : <><div className="w-4 h-4"><SaveIcon /></div>Save Changes</>}
            </button>
          )}
        </div>

        {/* Account details */}
        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-4 h-4 text-primary-600"><InfoIcon /></div>
            Account Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Account Created</label>
              <p className="text-sm font-medium text-gray-900">{formatDate(profile?.createdAt) || '—'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Last Login</label>
              <p className="text-sm font-medium text-gray-900">{formatDate(profile?.lastLogin) || '—'}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">User ID</label>
              <p className="text-xs font-mono text-gray-400 bg-gray-50 px-3 py-2 rounded-lg break-all">{user?.uid}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const UserIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const EditIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const XIcon     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const SaveIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
const ShieldIcon= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const InfoIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
