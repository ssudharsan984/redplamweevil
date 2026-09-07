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
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg mx-auto mb-3">
            <img src="/appstore-images/android/launchericon-192x192.png" alt="RPW" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-primary-700">RPW Detect</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 text-primary-600"><MailIcon /></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-6">
                We sent a password reset link to<br />
                <span className="font-semibold text-gray-700">{email}</span>
              </p>
              <div className="space-y-3">
                <button onClick={() => { setSent(false); setEmail('') }} className="btn-secondary w-full">
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
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <div className="w-6 h-6 text-primary-600"><KeyIcon /></div>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">Forgot Password?</h2>
                <p className="text-gray-400 text-sm mt-1">Enter your email and we'll send you a reset link.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                  <div className="w-4 h-4 flex-shrink-0"><AlertIcon /></div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"><MailIcon /></span>
                    <input type="email" className={`input pl-9 ${error ? 'border-red-400' : ''}`}
                      placeholder="you@example.com" value={email}
                      onChange={(e) => { setEmail(e.target.value); setError('') }}
                      autoComplete="email" />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                    : 'Send Reset Link'}
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

const MailIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const KeyIcon   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
const AlertIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
