import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiPlay, FiFileText, FiCheckCircle, FiZap, FiEdit, FiShare2 } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LandingPage = () => {
  const features = [
    {
      icon: <FiZap className="w-8 h-8" />,
      title: 'AI-Powered Generation',
      description: 'Transform your ideas into professional podcast scripts using Google Gemini AI'
    },
    {
      icon: <FiFileText className="w-8 h-8" />,
      title: 'Auto Summarization',
      description: 'Get concise summaries of your scripts instantly'
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" />,
      title: 'Smart Quizzes',
      description: 'Generate interactive quizzes from your content'
    },
    {
      icon: <FiEdit className="w-8 h-8" />,
      title: 'Easy Management',
      description: 'Save, edit, and organize all your scripts in one place'
    },
    {
      icon: <FiPlay className="w-8 h-8" />,
      title: 'Multiple Tones',
      description: 'Choose from conversational, formal, humorous, or storytelling styles'
    },
    {
      icon: <FiShare2 className="w-8 h-8" />,
      title: 'Seamless Workflow',
      description: 'From idea to finished script in minutes'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Turn Your Ideas Into
              <span className="gradient-text block mt-2">AI-Generated Podcast Scripts</span>
            </h1>
            <p className="text-xl text-dark-300 mb-10 max-w-3xl mx-auto">
              Create professional podcast scripts, summaries, and quizzes in minutes with the power of AI.
              No audio recording needed – just pure content creation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-outline text-lg">
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Hero Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="card max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-primary-900/20 to-primary-600/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FiPlay className="w-20 h-20 mx-auto text-primary-400 mb-4" />
                  <p className="text-2xl font-semibold">Your Scripts Come to Life Here</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="gradient-text"> Create Amazing Scripts</span>
            </h2>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto">
              Powerful features designed to streamline your content creation workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card hover:border-primary-400/50 cursor-pointer group"
              >
                <div className="text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-dark-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple <span className="gradient-text">Three-Step Process</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Enter Your Idea', desc: 'Share your topic and choose a tone' },
              { step: '2', title: 'AI Generates Content', desc: 'Get your script, summary, and quiz' },
              { step: '3', title: 'Save & Manage', desc: 'Access all your scripts anytime' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-dark-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900/20 to-primary-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create Your First Script?
            </h2>
            <p className="text-xl text-dark-300 mb-8">
              Join hundreds of content creators using ScriptCraftAI
            </p>
            <Link to="/signup" className="btn-primary text-lg">
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
