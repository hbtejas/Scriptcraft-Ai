import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-6">ScriptCraftAI</h1>
        <div className="loading-dots flex justify-center space-x-2">
          <span className="w-4 h-4 bg-primary-400 rounded-full"></span>
          <span className="w-4 h-4 bg-primary-400 rounded-full"></span>
          <span className="w-4 h-4 bg-primary-400 rounded-full"></span>
        </div>
      </motion.div>
    </div>
  )
}

export default LoadingScreen
