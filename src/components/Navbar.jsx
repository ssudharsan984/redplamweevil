import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomeIcon     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const ListIcon     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const LayersIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
const UserIcon     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const SettingsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
const MenuIcon     = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const CloseIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>

const navItems = [
  { to: '/dashboard', label: 'Dashboard',        icon: <HomeIcon /> },
  { to: '/history',   label: 'Detection History', icon: <ListIcon /> },
  { to: '/traps',     label: 'Trap Details',      icon: <LayersIcon /> },
  { to: '/profile',   label: 'My Profile',        icon: <UserIcon /> },
  { to: '/settings',  label: 'Settings',          icon: <SettingsIcon /> },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()

  const name     = profile?.fullName || user?.displayName || user?.email?.split('@')[0] || 'User'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shadow-sm">
        <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-600"
          onClick={() => setOpen(true)} aria-label="Open menu">
          <div className="w-5 h-5"><MenuIcon /></div>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-200">
            <img src="/appstore-images/android/launchericon-96x96.png" alt="RPW" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">RPW Detect</p>
            <p className="text-xs text-gray-400 leading-none mt-0.5">Detection System</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-full ml-2">
          <span className="pulse-dot" />
          <span className="text-xs text-primary-700 font-medium">Live</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-gray-800 leading-none">{name}</span>
            <span className="text-xs text-gray-400 truncate max-w-[150px] mt-0.5">{user?.email}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-primary-200 flex-shrink-0">
            {initials}
          </div>
          <button onClick={handleLogout}
            className="hidden sm:flex text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition font-medium">
            Sign out
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:top-14 md:z-20`}
        style={{ background: 'linear-gradient(180deg, #14532d 0%, #166534 60%, #15803d 100%)' }}>

        {/* Mobile header */}
        <div className="flex items-center justify-between px-4 py-4 md:hidden border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden">
              <img src="/appstore-images/android/launchericon-96x96.png" alt="RPW" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-white">RPW Detect</span>
          </div>
          <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-white/70">
            <div className="w-5 h-5"><CloseIcon /></div>
          </button>
        </div>

        {/* Mobile user */}
        <div className="md:hidden px-4 py-3 border-b border-white/10 bg-black/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">{initials}</div>
            <div>
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-green-300 truncate max-w-[160px]">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-widest px-3 mb-3">Menu</p>
          {navItems.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-white/15 text-white shadow-sm border border-white/10'
                  : 'text-green-100 hover:bg-white/10 hover:text-white'}`
              }>
              <span className="w-4 h-4 flex-shrink-0">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile logout */}
        <div className="md:hidden px-4 py-4 border-t border-white/10">
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 rounded-xl transition">
            Sign out
          </button>
        </div>

        <div className="hidden md:block px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <span className="pulse-dot" />
            <span className="text-xs text-green-300">System Online</span>
          </div>
          <p className="text-xs text-green-400/60">v1.0.0 · RPW Detection</p>
        </div>
      </aside>
    </>
  )
}
