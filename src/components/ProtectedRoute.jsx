import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-dots flex space-x-2">
          <span className="w-3 h-3 bg-primary-400 rounded-full"></span>
          <span className="w-3 h-3 bg-primary-400 rounded-full"></span>
          <span className="w-3 h-3 bg-primary-400 rounded-full"></span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
