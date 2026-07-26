import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (tab === 'register') {
      if (form.password !== form.confirm) return setError('Passwords do not match.')
      if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    }
    setLoading(true)
    try {
      if (tab === 'login') await login(form.email, form.password)
      else await register(form.email, form.password, form.name)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (t) => { setTab(t); setError(''); setForm({ name: '', email: '', password: '', confirm: '' }) }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full" />

        <div className="relative z-10 text-center">
          <div className="text-8xl mb-6 drop-shadow-2xl">🌴</div>
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">RPW Detection</h1>
          <p className="text-primary-200 text-lg mb-10">AI-Based Red Palm Weevil<br />Monitoring System</p>

          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { icon: '📡', label: 'Real-time Monitoring', desc: 'Live Firestore updates' },
              { icon: '🤖', label: 'AI Detection', desc: 'YOLO-powered analysis' },
              { icon: '🪤', label: 'Trap Management', desc: 'Multi-trap support' },
              { icon: '📊', label: 'Analytics', desc: 'Detection history & stats' },
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

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-5xl mb-2">🌴</div>
            <h1 className="text-2xl font-bold text-primary-700">RPW Detection System</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {['login', 'register'].map((t) => (
                <button
                  key={t}
                  onClick={() => switchTab(t)}
                  className={`flex-1 py-4 text-sm font-semibold capitalize transition-all
                    ${tab === t
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {t === 'login' ? '🔑 Sign In' : '✨ Create Account'}
                </button>
              ))}
            </div>

            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {tab === 'login' ? 'Welcome back!' : 'Get started today'}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                {tab === 'login' ? 'Sign in to your monitoring dashboard' : 'Create your RPW monitoring account'}
              </p>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {tab === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                      <input
                        type="text"
                        className="input pl-9"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                    <input
                      type="email"
                      className="input pl-9"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="input pl-9 pr-10"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      required
                      autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {tab === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="input pl-9"
                        placeholder="••••••••"
                        value={form.confirm}
                        onChange={(e) => update('confirm', e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-base mt-2 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {tab === 'login' ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    tab === 'login' ? '🔑 Sign In' : '✨ Create Account'
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
                  className="text-primary-600 font-semibold hover:underline"
                >
                  {tab === 'login' ? 'Create one' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            🌴 Red Palm Weevil Detection System · v1.0
          </p>
        </div>
      </div>
    </div>
  )
}

function getErrorMessage(code) {
  const messages = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-credential': 'Invalid credentials. Please check and try again.',
  }
  return messages[code] || 'Something went wrong. Please try again.'
}
