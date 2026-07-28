import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required.'
    if (!form.email.trim()) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.phone.trim()) e.phone = 'Phone number is required.'
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number.'
    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (!form.confirm) e.confirm = 'Please confirm your password.'
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password })
      toast.success('Account created successfully! Welcome to RPW Detect.')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, type = 'text', placeholder, autoComplete, icon, extra }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type={type}
          className={`input pl-9 ${extra || ''} ${errors[name] ? 'border-red-400 focus:ring-red-400' : ''}`}
          placeholder={placeholder}
          value={form[name]}
          onChange={(e) => set(name, e.target.value)}
          autoComplete={autoComplete}
        />
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 flex-col items-center justify-center p-10 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 mx-auto mb-5">
            <img src="/appstore-images/android/launchericon-192x192.png" alt="RPW" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">RPW Detect</h1>
          <p className="text-primary-200 text-sm mb-8">Join the AI-powered palm protection network</p>
          <div className="space-y-3 text-left">
            {[
              '🌴 Monitor your palm plantations',
              '🚨 Get instant RPW alerts',
              '📊 Track detection history',
              '🤖 AI-powered YOLO detection',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5">
                <span className="text-sm text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow mx-auto mb-2">
              <img src="/appstore-images/android/launchericon-192x192.png" alt="RPW" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-bold text-primary-700">RPW Detect</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">Create Account ✨</h2>
              <p className="text-gray-400 text-sm mt-1">Join RPW Detect and protect your plantation</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Field label="Full Name"     name="fullName" placeholder="John Doe"          icon="👤" autoComplete="name" />
              <Field label="Email Address" name="email"    placeholder="you@example.com"   icon="✉️" autoComplete="email" type="email" />
              <Field label="Phone Number"  name="phone"    placeholder="+91 9876543210"    icon="📱" autoComplete="tel" type="tel" />

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`input pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-1.5 flex gap-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        form.password.length >= i * 2
                          ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-yellow-400' : i <= 3 ? 'bg-blue-400' : 'bg-green-500'
                          : 'bg-gray-200'
                      }`} />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`input pl-9 ${errors.confirm ? 'border-red-400' : ''}`}
                    placeholder="Re-enter password"
                    value={form.confirm}
                    onChange={(e) => set('confirm', e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
              </div>

              {/* Role badge */}
              <div className="flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-xl px-4 py-2.5">
                <span>🌾</span>
                <div>
                  <p className="text-xs text-gray-500">Account Role</p>
                  <p className="text-sm font-semibold text-primary-700">Farmer</p>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 mt-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                  : '✨ Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function getErrorMessage(code) {
  const m = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email':        'Invalid email address.',
    'auth/weak-password':        'Password is too weak.',
    'auth/operation-not-allowed':'Email/Password sign-up is not enabled.',
  }
  return m[code] || 'Registration failed. Please try again.'
}
