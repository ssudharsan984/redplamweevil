import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.password) e.password = 'Password is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back! Redirecting...')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })) }

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />
        <div className="relative z-10 text-center">
          <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 mx-auto mb-6">
            <img src="/appstore-images/android/launchericon-192x192.png" alt="RPW" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">RPW Detect</h1>
          <p className="text-primary-200 text-base mb-10">Red Palm Weevil Detection<br />Monitoring System</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { icon: <SignalIcon />, label: 'Real-time Monitoring', desc: 'Live Firestore updates' },
              { icon: <CpuIcon />,    label: 'Smart Detection',      desc: 'YOLO-powered analysis' },
              { icon: <TrapIcon />,   label: 'Trap Management',      desc: 'Multi-trap support' },
              { icon: <ChartIcon />,  label: 'Analytics',            desc: 'Detection history & stats' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="w-8 h-8 text-white mb-2">{icon}</div>
                <p className="text-white font-semibold text-sm">{label}</p>
                <p className="text-primary-200 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg mx-auto mb-3">
              <img src="/appstore-images/android/launchericon-192x192.png" alt="RPW" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-primary-700">RPW Detect</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
              <p className="text-gray-400 text-sm mt-1">Sign in to your monitoring dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"><MailIcon /></span>
                  <input type="email" className={`input pl-9 ${errors.email ? 'border-red-400' : ''}`}
                    placeholder="you@example.com" value={form.email}
                    onChange={(e) => set('email', e.target.value)} autoComplete="email" />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline font-medium">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"><LockIcon /></span>
                  <input type={showPass ? 'text' : 'password'}
                    className={`input pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                    placeholder="Enter your password" value={form.password}
                    onChange={(e) => set('password', e.target.value)} autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-4 h-4">
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                  : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create Account</Link>
            </p>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">RPW Detection System · v1.0</p>
        </div>
      </div>
    </div>
  )
}

function getErrorMessage(code) {
  const m = {
    'auth/user-not-found':     'No account found with this email.',
    'auth/wrong-password':     'Incorrect password.',
    'auth/invalid-email':      'Invalid email address.',
    'auth/too-many-requests':  'Too many attempts. Please try again later.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-disabled':      'This account has been disabled.',
  }
  return m[code] || 'Login failed. Please check your credentials.'
}

const MailIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const LockIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const EyeIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOffIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
const SignalIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="1" y1="20" x2="1" y2="14"/><line x1="6" y1="20" x2="6" y2="10"/><line x1="11" y1="20" x2="11" y2="4"/><line x1="16" y1="20" x2="16" y2="8"/><line x1="21" y1="20" x2="21" y2="2"/></svg>
const CpuIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
const TrapIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
const ChartIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
