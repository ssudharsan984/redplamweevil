import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      console.error('Auth error:', err.code, err.message)
      setError(getErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />

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

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-5xl mb-2">🌴</div>
            <h1 className="text-2xl font-bold text-primary-700">RPW Detection System</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="mb-7">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🔐
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
              <p className="text-gray-400 text-sm mt-1">Sign in to access your monitoring dashboard</p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                  <input
                    type="email"
                    className="input pl-9"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : '🔑 Sign In'}
              </button>
            </form>

            <div className="mt-6 p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                🔒 Access is restricted to authorized users only.<br />
                Contact your administrator to get access.
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
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-disabled': 'This account has been disabled.',
  }
  return messages[code] || 'Login failed. Please check your credentials.'
}
