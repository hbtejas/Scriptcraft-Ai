import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiCalendar, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const Profile = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    if (!confirm('Are you sure you want to sign out?')) return
    
    setLoading(true)
    const { error } = await signOut()
    
    if (error) {
      toast.error('Failed to sign out')
      setLoading(false)
    } else {
      toast.success('Signed out successfully')
      navigate('/')
    }
  }

  const userMetadata = user?.user_metadata || {}
  const createdAt = user?.created_at ? new Date(user.created_at) : null

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8">
            <span className="gradient-text">Profile Settings</span>
          </h1>

          <div className="card mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-3xl font-bold">
                {(userMetadata.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {userMetadata.full_name || 'User'}
                </h2>
                <p className="text-dark-400">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-dark-300">
                <FiMail className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-sm text-dark-400">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-dark-300">
                <FiUser className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-sm text-dark-400">Full Name</p>
                  <p className="font-medium">{userMetadata.full_name || 'Not set'}</p>
                </div>
              </div>

              {createdAt && (
                <div className="flex items-center space-x-3 text-dark-300">
                  <FiCalendar className="w-5 h-5 text-primary-400" />
                  <div>
                    <p className="text-sm text-dark-400">Member Since</p>
                    <p className="font-medium">
                      {createdAt.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Account Actions</h3>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-dark-800/50 rounded-lg border border-dark-700">
            <p className="text-sm text-dark-400">
              <strong>Note:</strong> This is a demo profile page. In production, you would add features like:
              profile picture upload, name/email updates, password changes, account deletion, etc.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
