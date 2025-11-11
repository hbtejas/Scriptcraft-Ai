import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiEdit, FiTrash2, FiFileText, FiCheckCircle } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import QuizPlayer from '../components/QuizPlayer'
import { fetchScriptById, deleteScript, updateScript } from '../services/scriptService'
import toast from 'react-hot-toast'

const ScriptView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [script, setScript] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')

  useEffect(() => {
    loadScript()
  }, [id])

  const loadScript = async () => {
    const { data, error } = await fetchScriptById(id)
    
    if (error) {
      toast.error('Script not found')
      navigate('/dashboard')
    } else {
      setScript(data)
      setEditedTitle(data.title)
    }
    
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this script?')) return
    
    const { error } = await deleteScript(id)
    
    if (error) {
      toast.error('Failed to delete script')
    } else {
      toast.success('Script deleted successfully')
      navigate('/dashboard')
    }
  }

  const handleSaveTitle = async () => {
    if (!editedTitle.trim()) {
      toast.error('Title cannot be empty')
      return
    }

    const { error } = await updateScript(id, { title: editedTitle })
    
    if (error) {
      toast.error('Failed to update title')
    } else {
      setScript({ ...script, title: editedTitle })
      setEditing(false)
      toast.success('Title updated')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="card">
            <div className="skeleton h-8 w-2/3 mb-6"></div>
            <div className="skeleton h-4 w-full mb-3"></div>
            <div className="skeleton h-4 w-full mb-3"></div>
            <div className="skeleton h-4 w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!script) return null

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="flex items-center text-dark-300 hover:text-white mb-4 transition-colors">
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-start justify-between gap-4">
            {editing ? (
              <div className="flex-1">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="input-field text-2xl font-bold mb-2"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button onClick={handleSaveTitle} className="btn-primary text-sm">
                    Save
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-secondary text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <h1 className="text-4xl font-bold flex-1">{script.title}</h1>
            )}
            
            <div className="flex space-x-2">
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary p-3"
                  title="Edit title"
                >
                  <FiEdit className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="btn-secondary p-3 text-red-400 hover:bg-red-900/20"
                title="Delete script"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <p className="text-dark-400 mt-2">
            Created {new Date(script.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <FiFileText className="mr-2 text-primary-400" />
            Original Prompt
          </h2>
          <p className="text-dark-200">{script.prompt}</p>
        </motion.div>

        {/* Script */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <h2 className="text-2xl font-bold mb-4">Podcast Script</h2>
          <div className="bg-dark-900 rounded-lg p-6 max-h-[600px] overflow-y-auto">
            <p className="whitespace-pre-wrap leading-relaxed">{script.script}</p>
          </div>
        </motion.div>

        {/* Summary */}
        {script.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mb-6"
          >
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <div className="bg-dark-900 rounded-lg p-6">
              <p className="text-dark-200 leading-relaxed">{script.summary}</p>
            </div>
          </motion.div>
        )}

        {/* Quiz */}
        {script.quiz && Array.isArray(script.quiz) && script.quiz.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FiCheckCircle className="mr-2 text-primary-400" />
              Quiz
            </h2>
            <QuizPlayer questions={script.quiz} />
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ScriptView
