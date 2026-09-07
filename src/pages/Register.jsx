import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

// InputField MUST be outside Register to prevent re-mount on every keystroke
function InputField({ label, error, icon, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none">{icon}</span>
        {children}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function Register() {
  const [fullName, setFullName]   = useState('')
  const [email, setEmail]         = useState('')
  const [phone, setPhone]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [errors, setErrors]       = useState({})
  const [loading, setLoading]     = useState(false)
  const { register }              = useAuth()
  const toast                     = useToast()
  const navigate                  = useNavigate()

  const clearErr = (k) => setErrors((p) => ({ ...p, [k]: '' }))

  const validate = () => {
    const e = {}
    if (!fullName.trim()) e.fullName = 'Full name is required.'
    if (!email.trim()) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.'
    if (!phone.trim()) e.phone = 'Phone number is required.'
    else if (!/^\+?[\d\s\-]{7,15}$/.test(phone)) e.phone = 'Enter a valid phone number.'
    if (!password) e.password = 'Password is required.'
    else if (password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (!confirm) e.confirm = 'Please confirm your password.'
    else if (password !== confirm) e.confirm = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register({ fullName, email, phone, password })
      toast.success('Account created successfully!')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const strengthLevel = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : password.length < 12 ? 3 : 4
  const strengthColor = ['bg-gray-200', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500']
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']

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
          <p className="text-primary-200 text-sm mb-8">Join the palm protection network</p>
          <div className="space-y-3 text-left">
            {[
              'Monitor your palm plantations',
              'Get instant RPW detection alerts',
              'Track full detection history',
              'Smart YOLO-powered analysis',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5">
                <div className="w-4 h-4 text-primary-200 flex-shrink-0"><CheckIcon /></div>
                <span className="text-sm text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <div className="lg:hidden text-center mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow mx-auto mb-2">
              <img src="/appstore-images/android/launchericon-192x192.png" alt="RPW" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-bold text-primary-700">RPW Detect</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">Create Account</h2>
              <p className="text-gray-400 text-sm mt-1">Join RPW Detect and protect your plantation</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <InputField label="Full Name" error={errors.fullName} icon={<UserIcon />}>
                <input
                  type="text"
                  className={`input pl-9 ${errors.fullName ? 'border-red-400' : ''}`}
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); clearErr('fullName') }}
                  autoComplete="name"
                />
              </InputField>

              <InputField label="Email Address" error={errors.email} icon={<MailIcon />}>
                <input
                  type="email"
                  className={`input pl-9 ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearErr('email') }}
                  autoComplete="email"
                />
              </InputField>

              <InputField label="Phone Number" error={errors.phone} icon={<PhoneIcon />}>
                <input
                  type="tel"
                  className={`input pl-9 ${errors.phone ? 'border-red-400' : ''}`}
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearErr('phone') }}
                  autoComplete="tel"
                />
              </InputField>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"><LockIcon /></span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`input pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearErr('password') }}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-4 h-4">
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strengthLevel ? strengthColor[strengthLevel] : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">Password strength: <span className="font-medium">{strengthLabel[strengthLevel]}</span></p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"><LockIcon /></span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`input pl-9 ${errors.confirm ? 'border-red-400' : ''}`}
                    placeholder="Re-enter password"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); clearErr('confirm') }}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
              </div>

              {/* Role */}
              <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
                <div className="w-5 h-5 text-primary-600"><ShieldIcon /></div>
                <div>
                  <p className="text-xs text-gray-500">Account Role</p>
                  <p className="text-sm font-semibold text-primary-700">Farmer</p>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                  : 'Create Account'}
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
    'auth/email-already-in-use':  'An account with this email already exists.',
    'auth/invalid-email':         'Invalid email address.',
    'auth/weak-password':         'Password is too weak.',
    'auth/operation-not-allowed': 'Email/Password sign-up is not enabled.',
  }
  return m[code] || 'Registration failed. Please try again.'
}

const UserIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const MailIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const PhoneIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const LockIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const EyeIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOffIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
const CheckIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>
const ShieldIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
