import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DetectionHistory from './pages/DetectionHistory'
import TrapDetails from './pages/TrapDetails'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <PWAInstallPrompt />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><DetectionHistory /></ProtectedRoute>} />
          <Route path="/traps" element={<ProtectedRoute><TrapDetails /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
