import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

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

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-primary-700 text-white shadow-md h-14 flex items-center px-4 gap-3">
        <button
          className="md:hidden p-1 rounded hover:bg-primary-800 transition"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-lg font-bold tracking-tight flex items-center gap-2">
          🌴 RPW Detection
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden sm:block text-sm text-primary-100 truncate max-w-[180px]">
            {user?.email}
          </span>
          <button onClick={handleLogout} className="text-sm bg-primary-800 hover:bg-primary-900 px-3 py-1.5 rounded-lg transition">
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary-800 text-white flex flex-col transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:top-14 md:z-20`}
      >
        <div className="flex items-center justify-between px-4 py-4 md:hidden border-b border-primary-700">
          <span className="font-bold text-lg">🌴 RPW Detect</span>
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-primary-700 rounded">✕</button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-primary-600 text-white' : 'text-primary-100 hover:bg-primary-700'}`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-primary-700 text-xs text-primary-300">
          v1.0.0 · RPW Detection System
        </div>
      </aside>
    </>
  )
}
