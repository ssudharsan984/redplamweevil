import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/history', label: 'Detection History', icon: '📋' },
  { to: '/traps', label: 'Trap Details', icon: '🪤' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-primary-700 text-white shadow-lg h-14 flex items-center px-4 gap-3">
        <button
          className="md:hidden p-1.5 rounded-lg hover:bg-primary-600 transition"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <img src="/appstore-images/android/launchericon-96x96.png" alt="RPW" className="w-7 h-7 rounded-lg" />
          <span className="font-bold text-base tracking-tight hidden sm:block">RPW Detection</span>
          <span className="font-bold text-base tracking-tight sm:hidden">RPW</span>
        </div>

        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 bg-primary-600/50 px-2.5 py-1 rounded-full ml-2">
          <span className="pulse-dot" />
          <span className="text-xs text-primary-100 font-medium">Live</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-white leading-none">
              {user?.displayName || 'Admin'}
            </span>
            <span className="text-xs text-primary-200 truncate max-w-[160px]">{user?.email}</span>
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary-500 border-2 border-primary-300 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {initials}
          </div>

          <button
            onClick={handleLogout}
            className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg transition font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-primary-900 to-primary-800 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out shadow-2xl
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:top-14 md:z-20`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-4 md:hidden border-b border-primary-700/50">
          <div className="flex items-center gap-2">
            <img src="/appstore-images/android/launchericon-96x96.png" alt="RPW" className="w-8 h-8 rounded-lg" />
            <span className="font-bold">RPW Detect</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-primary-700 rounded-lg transition text-primary-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info (mobile) */}
        <div className="md:hidden px-4 py-3 border-b border-primary-700/50 bg-primary-800/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.displayName || 'Admin'}</p>
              <p className="text-xs text-primary-300 truncate max-w-[160px]">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs font-semibold text-primary-400 uppercase tracking-widest px-3 mb-3">Navigation</p>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-white/15 text-white shadow-sm border border-white/10'
                  : 'text-primary-200 hover:bg-white/8 hover:text-white'
                }`
              }
            >
              <span className="text-lg w-6 text-center">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-primary-700/50">
          <div className="flex items-center gap-2 mb-3">
            <img src="/appstore-images/android/launchericon-48x48.png" alt="" className="w-5 h-5 rounded" />
            <span className="text-xs text-primary-300">System Online</span>
          </div>
          <p className="text-xs text-primary-400">v1.0.0 · RPW Detection System</p>
        </div>
      </aside>
    </>
  )
}
