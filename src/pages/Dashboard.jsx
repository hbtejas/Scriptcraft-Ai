import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiFileText, FiTrash2, FiEye, FiCalendar } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import useAuthStore from '../store/authStore'
import { fetchUserScripts, deleteScript } from '../services/scriptService'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuthStore()
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScripts()
  }, [user])

  const loadScripts = async () => {
    if (!user) return
    
    setLoading(true)
    const { data, error } = await fetchUserScripts(user.id)
    
    if (error) {
      toast.error('Failed to load scripts')
    } else {
      setScripts(data || [])
    }
    
    setLoading(false)
  }

  const handleDelete = async (scriptId) => {
    if (!confirm('Are you sure you want to delete this script?')) return
    
    const { error } = await deleteScript(scriptId)
    
    if (error) {
      toast.error('Failed to delete script')
    } else {
      toast.success('Script deleted successfully')
      setScripts(scripts.filter(s => s.id !== scriptId))
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{user?.user_metadata?.full_name || 'Creator'}</span>
            </h1>
            <p className="text-dark-300">Manage your podcast scripts and continue creating</p>
          </div>
          <Link to="/generator" className="btn-primary flex items-center space-x-2">
            <FiPlus className="w-5 h-5" />
            <span>New Script</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">Total Scripts</p>
                <p className="text-3xl font-bold gradient-text">{scripts.length}</p>
              </div>
              <FiFileText className="w-12 h-12 text-primary-400 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold gradient-text">
                  {scripts.filter(s => {
                    const created = new Date(s.created_at)
                    const now = new Date()
                    return created.getMonth() === now.getMonth() && 
                           created.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
              <FiCalendar className="w-12 h-12 text-primary-400 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm font-medium">With Quizzes</p>
                <p className="text-3xl font-bold gradient-text">
                  {scripts.filter(s => s.quiz).length}
                </p>
              </div>
              <FiFileText className="w-12 h-12 text-primary-400 opacity-50" />
            </div>
          </motion.div>
        </div>

        {/* Scripts List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Scripts</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="card">
                  <div className="skeleton h-6 w-3/4 mb-4"></div>
                  <div className="skeleton h-4 w-full mb-2"></div>
                  <div className="skeleton h-4 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : scripts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center py-12"
            >
              <FiFileText className="w-16 h-16 text-dark-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No scripts yet</h3>
              <p className="text-dark-300 mb-6">Create your first podcast script to get started</p>
              <Link to="/generator" className="btn-primary inline-flex items-center space-x-2">
                <FiPlus className="w-5 h-5" />
                <span>Create Script</span>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scripts.map((script, index) => (
                <motion.div
                  key={script.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card group hover:border-primary-400/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold line-clamp-2 flex-1">
                      {script.title}
                    </h3>
                  </div>
                  
                  <p className="text-dark-300 text-sm line-clamp-3 mb-4">
                    {script.summary || script.script?.substring(0, 150) + '...'}
                  </p>
                  
                  <div className="flex items-center text-xs text-dark-400 mb-4">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(script.created_at)}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/script/${script.id}`}
                      className="flex-1 btn-primary py-2 text-sm flex items-center justify-center space-x-1"
                    >
                      <FiEye className="w-4 h-4" />
                      <span>View</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(script.id)}
                      className="btn-secondary py-2 px-4 text-sm text-red-400 hover:bg-red-900/20"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
