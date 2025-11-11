import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold gradient-text mb-3">ScriptCraftAI</h3>
            <p className="text-dark-400 mb-4">
              Turn your ideas into AI-generated podcast scripts with summaries and quizzes.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-400 transition-colors">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-400 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-dark-400 hover:text-primary-400 transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-dark-400 hover:text-primary-400 transition-colors">Features</Link></li>
              <li><Link to="/signup" className="text-dark-400 hover:text-primary-400 transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-dark-400 hover:text-primary-400 transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-dark-400 hover:text-primary-400 transition-colors">About</a></li>
              <li><a href="#" className="text-dark-400 hover:text-primary-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-dark-400 hover:text-primary-400 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-700 text-center text-dark-400">
          <p>&copy; {new Date().getFullYear()} ScriptCraftAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
