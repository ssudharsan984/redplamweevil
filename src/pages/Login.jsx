import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const { login }               = useAuth()
  const toast                   = useToast()
  const navigate                = useNavigate()

  const validate = () => {
    const e = {}
    if (!email.trim()) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.'
    if (!password) e.password = 'Password is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #14532d 0%, #166534 40%, #15803d 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #4ade80 0%, transparent 50%), radial-gradient(circle at 80% 20%, #86efac 0%, transparent 50%)' }} />
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 w-full">
          <div className="mb-10">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl mb-6 ring-2 ring-white/20">
              <img src="/appstore-images/android/launchericon-192x192.png" alt="RPW" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">RPW Detect</h1>
            <p className="text-green-200 text-lg leading-relaxed">
              Protecting palm plantations with intelligent detection technology.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Real-time Monitoring',  desc: 'Live updates from all your traps instantly' },
              { title: 'Smart Detection',       desc: 'YOLO-powered AI identifies RPW accurately' },
              { title: 'Complete History',      desc: 'Full detection logs with images and timestamps' },
              { title: 'Multi-trap Support',    desc: 'Manage all your traps from one dashboard' },
            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                <div className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5"><CheckIcon /></div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-green-200 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-green-300 text-xs mt-10">RPW Detection System · v1.0.0</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg mx-auto mb-3">
              <img src="/appstore-images/android/launchericon-192x192.png" alt="RPW" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-primary-700">RPW Detect</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
              <p className="text-gray-500 text-sm mt-1">Access your monitoring dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"><MailIcon /></span>
                  <input type="email" className={`input pl-10 ${errors.email ? 'border-danger-400 focus:ring-danger-400' : ''}`}
                    placeholder="you@example.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})) }}
                    autoComplete="email" />
                </div>
                {errors.email && <p className="text-danger-500 text-xs mt-1.5 flex items-center gap-1"><AlertIcon className="w-3 h-3" />{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 font-medium hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"><LockIcon /></span>
                  <input type={showPass ? 'text' : 'password'}
                    className={`input pl-10 pr-10 ${errors.password ? 'border-danger-400 focus:ring-danger-400' : ''}`}
                    placeholder="Enter your password" value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: ''})) }}
                    autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <p className="text-danger-500 text-xs mt-1.5 flex items-center gap-1"><AlertIcon className="w-3 h-3" />{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
                {loading ? <><Spinner />Signing in...</> : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getErrorMessage(code) {
  const m = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-disabled': 'This account has been disabled.',
  }
  return m[code] || 'Login failed. Please check your credentials.'
}

const Spinner   = () => <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
const MailIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const LockIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const EyeIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOffIcon= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>
const AlertIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
