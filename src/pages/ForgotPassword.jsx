import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [error, setError]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const { forgotPassword }    = useAuth()
  const toast                 = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Email is required.')
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Enter a valid email address.')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
      toast.success('Password reset email sent!')
    } catch (err) {
      const msg = err.code === 'auth/user-not-found'
        ? 'No account found with this email.'
        : 'Failed to send reset email. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg mx-auto mb-3">
            <img src="/appstore-images/android/launchericon-192x192.png" alt="RPW" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-primary-700">RPW Detect</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-6">
                We sent a password reset link to<br />
                <span className="font-semibold text-gray-700">{email}</span>
              </p>
              <div className="space-y-3">
                <button onClick={() => { setSent(false); setEmail('') }}
                  className="btn-secondary w-full">
                  Try another email
                </button>
                <Link to="/login" className="btn-primary w-full flex items-center justify-center">
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-gray-900">Forgot Password? 🔑</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                    <input
                      type="email"
                      className={`input pl-9 ${error ? 'border-red-400' : ''}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError('') }}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                    : '📧 Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Remember your password?{' '}
                <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
