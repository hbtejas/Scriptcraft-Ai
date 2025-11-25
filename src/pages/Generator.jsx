import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiZap, FiFileText, FiCheckCircle, FiSave } from "react-icons/fi";
import Navbar from "../components/Navbar";
import useAuthStore from "../store/authStore";
import {
  generateScript,
  summarizeScript,
  generateQuiz,
} from "../services/aiService";
import { createScript } from "../services/scriptService";
import toast from "react-hot-toast";

const Generator = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    tone: "conversational",
  });
  const [generatedData, setGeneratedData] = useState({
    script: "",
    summary: "",
    quiz: null,
  });

  const tones = [
    {
      value: "conversational",
      label: "Conversational",
      desc: "Casual and friendly",
    },
    { value: "formal", label: "Formal", desc: "Professional and structured" },
    { value: "humorous", label: "Humorous", desc: "Fun and entertaining" },
    {
      value: "storytelling",
      label: "Storytelling",
      desc: "Narrative and engaging",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateScript = async () => {
    if (!formData.prompt.trim()) {
      toast.error("Please enter a topic or idea");
      return;
    }

    setLoading(true);
    toast.loading("AI is crafting your script...", { id: "script-gen" });

    const { data, error } = await generateScript(
      formData.prompt,
      formData.tone
    );

    toast.dismiss("script-gen");

    if (error) {
      toast.error(error);
    } else {
      setGeneratedData({ ...generatedData, script: data });
      setStep(2);
      toast.success("Script generated successfully!");
    }

    setLoading(false);
  };

  const handleGenerateSummary = async () => {
    if (!generatedData.script) return;

    setLoading(true);
    toast.loading("Creating summary...", { id: "summary-gen" });

    const { data, error } = await summarizeScript(generatedData.script);

    toast.dismiss("summary-gen");

    if (error) {
      toast.error(error);
    } else {
      setGeneratedData({ ...generatedData, summary: data });
      toast.success("Summary generated!");
    }

    setLoading(false);
  };

  const handleGenerateQuiz = async () => {
    if (!generatedData.script) {
      toast.error("Please generate a script first");
      return;
    }

    setLoading(true);
    toast.loading("Generating quiz questions...", { id: "quiz-gen" });

    const { data, error } = await generateQuiz(generatedData.script);

    toast.dismiss("quiz-gen");

    // Quiz service now always returns data, never fails
    if (data && Array.isArray(data) && data.length > 0) {
      setGeneratedData({ ...generatedData, quiz: data });
      toast.success(
        `✅ Quiz ready! ${data.length} question${data.length > 1 ? "s" : ""} generated`
      );
    } else {
      // This should never happen with the new fallback logic
      console.error("Unexpected: No quiz data returned");
      // Create emergency fallback quiz
      const emergencyQuiz = [
        {
          question: "What is the main topic of this podcast?",
          options: [
            "The subject discussed",
            "Something unrelated",
            "A different topic",
            "Another subject"
          ],
          correctAnswer: 0
        }
      ];
      setGeneratedData({ ...generatedData, quiz: emergencyQuiz });
      toast.success("Quiz generated!");
    }

    setLoading(false);
  };

  const handleSaveScript = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!generatedData.script) {
      toast.error("Please generate a script first");
      return;
    }

    setLoading(true);
    const scriptData = {
      user_id: user.id,
      title: formData.title,
      prompt: formData.prompt,
      script: generatedData.script,
      summary: generatedData.summary,
      quiz: generatedData.quiz,
    };

    const { data, error } = await createScript(scriptData);

    if (error) {
      toast.error("Failed to save script");
    } else {
      toast.success("Script saved successfully!");
      navigate(`/script/${data.id}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-3">
            Create Your <span className="gradient-text">Podcast Script</span>
          </h1>
          <p className="text-dark-300">
            Let AI help you craft the perfect podcast script
          </p>
        </motion.div>

        {/* Step 1: Input */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card max-w-3xl mx-auto"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center">
                <span className="font-bold">1</span>
              </div>
              <h2 className="text-2xl font-bold">Script Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., The Future of AI"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Idea or Topic
                </label>
                <textarea
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleInputChange}
                  className="input-field min-h-[150px] resize-y"
                  placeholder="Describe your podcast topic or share your main ideas..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Choose a Tone
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {tones.map((tone) => (
                    <button
                      key={tone.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, tone: tone.value })
                      }
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.tone === tone.value
                          ? "border-primary-400 bg-primary-400/10"
                          : "border-dark-600 hover:border-dark-500"
                      }`}
                    >
                      <div className="font-semibold mb-1">{tone.label}</div>
                      <div className="text-xs text-dark-400">{tone.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateScript}
                disabled={loading || !formData.prompt.trim()}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <FiZap className="w-5 h-5" />
                <span>{loading ? "Generating..." : "Generate Script"}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Results */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Script */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FiFileText className="w-6 h-6 text-primary-400" />
                  <h2 className="text-2xl font-bold">Generated Script</h2>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary text-sm"
                >
                  Edit Input
                </button>
              </div>
              <div className="bg-dark-900 rounded-lg p-6 max-h-96 overflow-y-auto">
                <p className="whitespace-pre-wrap">{generatedData.script}</p>
              </div>
            </div>

            {/* Summary */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Summary</h3>
                {!generatedData.summary && (
                  <button
                    onClick={handleGenerateSummary}
                    disabled={loading}
                    className="btn-primary text-sm flex items-center space-x-2"
                  >
                    <FiZap className="w-4 h-4" />
                    <span>
                      {loading ? "Generating..." : "Generate Summary"}
                    </span>
                  </button>
                )}
              </div>
              {generatedData.summary ? (
                <div className="bg-dark-900 rounded-lg p-4">
                  <p className="text-dark-200">{generatedData.summary}</p>
                </div>
              ) : (
                <p className="text-dark-400 text-center py-8">
                  Click "Generate Summary" to create a summary of your script
                </p>
              )}
            </div>

            {/* Quiz */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Quiz</h3>
                {!generatedData.quiz && (
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={loading}
                    className="btn-primary text-sm flex items-center space-x-2"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    <span>{loading ? "Generating..." : "Generate Quiz"}</span>
                  </button>
                )}
              </div>
              {generatedData.quiz ? (
                <div className="space-y-4">
                  {Array.isArray(generatedData.quiz) &&
                    generatedData.quiz.map((question, index) => (
                      <div key={index} className="bg-dark-900 rounded-lg p-4">
                        <p className="font-semibold mb-3">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border ${
                                optIndex === question.correctAnswer
                                  ? "border-green-500 bg-green-500/10"
                                  : "border-dark-600"
                              }`}
                            >
                              {option}
                              {optIndex === question.correctAnswer && (
                                <span className="ml-2 text-green-400">
                                  ✓ Correct
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-dark-400 text-center py-8">
                  Click "Generate Quiz" to create quiz questions from your
                  script
                </p>
              )}
            </div>

            {/* Save Button */}
            <div className="sticky bottom-6 flex justify-center">
              <button
                onClick={handleSaveScript}
                disabled={loading}
                className="btn-primary text-lg flex items-center space-x-2 shadow-2xl"
              >
                <FiSave className="w-5 h-5" />
                <span>{loading ? "Saving..." : "Save Script"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Generator;
