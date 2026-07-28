import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const toast                 = useToast()
  const navigate              = useNavigate()

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
          <p className="text-primary-200 text-base mb-10">AI-Based Red Palm Weevil<br />Monitoring System</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { icon: '📡', label: 'Real-time Monitoring', desc: 'Live Firestore updates' },
              { icon: '🤖', label: 'AI Detection',         desc: 'YOLO-powered analysis' },
              { icon: '🪤', label: 'Trap Management',      desc: 'Multi-trap support' },
              { icon: '📊', label: 'Analytics',            desc: 'Detection history & stats' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-2xl mb-1">{icon}</div>
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
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg mx-auto mb-3">
              <img src="/appstore-images/android/launchericon-192x192.png" alt="RPW" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-primary-700">RPW Detect</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-extrabold text-gray-900">Welcome back 👋</h2>
              <p className="text-gray-400 text-sm mt-1">Sign in to your monitoring dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">✉️</span>
                  <input
                    type="email"
                    className={`input pl-9 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline font-medium">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`input pl-9 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                  : '🔑 Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create Account</Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">🌴 RPW Detection System · v1.0</p>
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
