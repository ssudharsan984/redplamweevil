// Re-export the single source of truth from our AuthContext provider.
// This avoids duplicated provider logic and keeps the hook consistent
// across all components that import from '../hooks/useAuth'.
export { useAuth, AuthProvider } from '../context/AuthContext'
