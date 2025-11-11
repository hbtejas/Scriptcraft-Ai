import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi'

const QuizPlayer = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const handleSelectAnswer = (index) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(index)
    
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
    
    setTimeout(() => {
      setShowResult(true)
    }, 300)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizCompleted(false)
  }

  if (!questions || questions.length === 0) {
    return (
      <p className="text-center text-dark-400 py-8">
        No quiz questions available
      </p>
    )
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
            {percentage}%
          </div>
          <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
          <p className="text-dark-300">
            You got {score} out of {questions.length} questions correct
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button onClick={handleRestart} className="btn-primary flex items-center space-x-2">
            <FiRefreshCw className="w-5 h-5" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </motion.div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-dark-400 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            className="bg-primary-400 h-2 rounded-full transition-all duration-300"
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h3 className="text-xl font-semibold mb-6">{question.question}</h3>

          <div className="space-y-3 mb-6">
            {question.options?.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.correctAnswer
              const showCorrectAnswer = showResult && isCorrect
              const showWrongAnswer = showResult && isSelected && !isCorrect

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    showCorrectAnswer
                      ? 'border-green-500 bg-green-500/10'
                      : showWrongAnswer
                      ? 'border-red-500 bg-red-500/10'
                      : isSelected
                      ? 'border-primary-400 bg-primary-400/10'
                      : 'border-dark-600 hover:border-dark-500'
                  } ${selectedAnswer !== null ? 'cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrectAnswer && (
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {showWrongAnswer && (
                      <FiXCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <button onClick={handleNextQuestion} className="btn-primary">
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default QuizPlayer
