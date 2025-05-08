import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, FileText, CheckCircle, BarChart, MessageSquare, 
  ChevronLeft, ChevronRight, RefreshCw, Clock, Users, 
  TrendingUp, AlertTriangle, Zap, ThumbsUp,
  UploadCloud,
  Link,
  MessageCircle,
  ShieldOff,
  BarChart2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addSurveyResponse } from "@/lib/utils";

// Combined fields for demo booking with selected survey questions
const formFields = [

  // Problem-focused questions to trigger interest
  {
    id: 'time_spent',
    label: 'How many hours per week do you spend creating reports, analysing data?',
    icon: Clock,
    type: 'mcq',
    options: [
      "Less than 2 hours",
      "2-5 hours",
      "5-10 hours",
      "More than 10 hours",
      "I've stopped counting..."
    ],
    required: false,
  },
  {
    id: 'biggest_pain',
    label: 'What\'s your biggest report creation/data analysis headache?',
    icon: AlertTriangle,
    type: 'mcq',
    options: [
      "Gathering data from multiple sources",
      "Making the data tell a clear story",
      "Keeping reports up-to-date",
      "Getting actionable insights",
      "Reports taking too much time to create"
    ],
    required: false,
  },
  {
    id: 'decision_quality',
    label: 'How confident are you in the quality of decisions based on your current reports?',
    icon: ThumbsUp,
    type: 'mcq',
    options: [
      "Very confident - our data is perfect",
      "Somewhat confident - but could be better",
      "Neutral - it works but has limitations",
      "Not very confident - plenty of blind spots",
      "Not confident at all - major improvements needed"
    ],
    required: false,
  },
  {
    id: 'missed_insights',
    label: 'Have you ever discovered critical insights too late because they were buried in reports/data?',
    icon: Zap,
    type: 'mcq',
    options: [
      "Yes, frequently - and it's costly",
      "Yes, occasionally",
      "Maybe, but not sure how much we've missed",
      "Rarely",
      "Never - we catch everything"
    ],
    required: false,
  },
  {
    id: 'current_process',
    label: 'How do you currently handle your report/data analysis process?',
    icon: FileText,
    type: 'mcq',
    options: [
      "Mostly manual Excel/Google Sheets",
      "Mix of tools but still requires lots of human effort",
      "Automated dashboards but limited insights",
      "We have a dedicated team just for this",
      "We struggle to maintain consistent reporting"
    ],
    required: false,
  },
  {
    id: 'department',
    label: 'Which area needs the most report/data analysis improvement?',
    icon: BarChart,
    type: 'mcq',
    options: [
      "Projects & Delivery",
      "HR & Team Performance",
      "Finance & Compliance",
      "Legal & Risk",
      "All of the above"
    ],
    required: false,
  },
  {
    id: 'ai_value',
    label: 'If AI could analyze your data and surface key insights automatically, what would be most valuable?',
    icon: CheckCircle,
    type: 'multi',
    options: [
      "Time savings (no more manual reporting)",
      "Catching problems before they escalate",
      "Discovering patterns humans might miss",
      "Getting recommendations for improvement",
      "Having answers to questions in seconds, not days"
    ],
    maxSelections: 3,
    required: false,
  },
  {
    id: 'data_sources',
    label: 'Which data sources do you struggle to connect or analyze?',
    icon: UploadCloud,
    type: 'multi',
    options: [
      "PDF reports and documents",
      "Excel/CSV files with complex data",
      "Cloud storage (Google Drive, Dropbox)",
      "Business systems (CRM, ERP, HRIS)",
      "Communication tools (Slack, Teams, Email)"
    ],
    maxSelections: 3,
    required: false,
  },
  {
    id: 'date',
    label: 'When would you like to see how we can eliminate these problems? Pick a date for a quick call.',
    icon: Clock,
    type: 'input',
    inputType: 'datetime-local',
    placeholder: '',
    required: false,
  },
  {
    id: 'notes',
    label: 'Any specific report/data analysis challenges you want us to address in the demo?',
    icon: MessageSquare,
    type: 'textarea',
    placeholder: 'Tell us about your biggest report/data analysis challenges...',
    required: false,
  },
  // Demo booking contact fields
  {
    id: 'name',
    label: 'Full Name',
    icon: Users,
    type: 'input',
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    id: 'email',
    label: 'Email',
    icon: MessageCircle,
    type: 'input',
    inputType: 'email',
    placeholder: 'you@company.com',
    required: true,
  },
  {
    id: 'company',
    label: 'Company Name',
    icon: FileText,
    type: 'input',
    placeholder: 'Your company',
    required: true,
  },
  {
    id: 'role',
    label: 'Role/Title',
    icon: BarChart,
    type: 'input',
    placeholder: 'Your role or title',
    required: false,
  },
  {
    id: 'company_size',
    label: 'Company Size',
    icon: Users,
    type: 'mcq',
    options: [
      '1-10', '11-50', '51-200', '201-1000', '1000+'
    ],
    required: false,
  },
  {
    id: 'notes',
    label: 'Anything specific you want to see?',
    icon: MessageSquare,
    type: 'textarea',
    placeholder: 'Share your goals or questions...',
    required: false,
  }
];

const DemoExperience = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  const totalSteps = formFields.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!started || completed) return;
      if (e.key === "ArrowRight" && isNextButtonEnabled()) {
        if (currentStep < formFields.length - 1) {
          setCurrentStep(s => s + 1);
        } else {
          handleSubmit();
        }
      } else if (e.key === "ArrowLeft" && currentStep > 0) {
        setCurrentStep(s => s - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [started, currentStep, answers, completed]);

  // Handle input/textarea answer change
  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [formFields[currentStep].id]: value }));
  };

  // For MCQ fields
  const handleMCQ = (option) => {
    setAnswers(prev => ({ ...prev, [formFields[currentStep].id]: option }));
  };

  // For multi-select fields
  const handleMultiSelect = (option) => {
    const fieldId = formFields[currentStep].id;
    const currentSelections = answers[fieldId] || [];
    let newSelections;
    
    if (currentSelections.includes(option)) {
      // Remove option if already selected
      newSelections = currentSelections.filter(item => item !== option);
    } else {
      // Add option if within maxSelections limit
      if (currentSelections.length < formFields[currentStep].maxSelections) {
        newSelections = [...currentSelections, option];
      } else {
        newSelections = currentSelections;
      }
    }
    
    setAnswers(prev => ({ ...prev, [fieldId]: newSelections }));
  };

  // Check if the next button should be enabled
  const isNextButtonEnabled = () => {
    const currentField = formFields[currentStep];
    const answer = answers[currentField.id];
    
    if (currentField.required) {
      if (currentField.type === 'multi') {
        return answer && answer.length > 0;
      }
      return answer !== undefined && answer !== '';
    }
    return true;
  };

  // Submit answers to backend
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await addSurveyResponse(answers);
      setCompleted(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get section background based on current step
  const getSectionBackground = () => {
    const sectionColors = [
      "from-blue-500 to-purple-600",
      "from-purple-500 to-pink-600",
      "from-indigo-500 to-blue-600",
      "from-pink-500 to-orange-600",
      "from-teal-500 to-blue-600",
      "from-green-500 to-teal-600",
      "from-violet-500 to-purple-600",
    ];
    return sectionColors[currentStep % sectionColors.length];
  };

  return (
    <motion.section 
      id="experience"
      initial={{ opacity: 0, y: 50 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, amount: 0.3 }} 
      transition={{ duration: 0.8 }} 
      className="py-32 relative overflow-hidden "
    >
      {/* Branded accent elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-[#7f5fff] to-[#32c5ff] rounded-full opacity-80 animate-pulse mb-10" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-[#32c5ff] to-[#ff6fd8] rounded-full opacity-70 mb-8" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="px-3 py-2 text-xs font-medium bg-[#7f5fff]/20 text-[#7f5fff] rounded-full">
            nomore.report
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Eliminates analysis and reporting grunt work
          </h1>
          {/* <p className="text-white/80 max-w-xl mx-auto">
            See how our AI can transform your reporting/data analysis workflow and eliminate repetitive tasks. Book a demo.
          </p> */}
        </div>

        {/* Progress bar (only shown when form started) */}
        {started && !completed && (
          <div className="w-full max-w-2xl mx-auto mb-6">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getSectionBackground()} transition-all duration-500 ease-out`} 
                style={{ width: `${progressPercentage}%` }} 
              />
            </div>
          </div>
        )}

        {/* Card content */}
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="start-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-8 md:p-10 max-w-2xl mx-auto"
            >
              <div className="text-center space-y-6">
                <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-white">Schedule Your Personalized Demo</h2>
                
                <p className="text-white/80 text-lg">
                See how our AI can transform your reporting/data analysis workflow and eliminate repetitive tasks. Book a demo.
                </p>
                
                <ul className="flex flex-wrap justify-center gap-4 text-white/70">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" /> Quick Form</li>
                  <li className="flex items-center"><Clock className="h-4 w-4 text-blue-400 mr-2" /> Takes ~3 Minutes</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-yellow-400 mr-2" /> Personalized Demo</li>
                </ul>
                
                <button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-blue-600 transition-all text-lg w-full md:w-auto"
                  onClick={() => setStarted(true)}
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          ) : completed ? (
            <motion.div
              key="completion-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-8 md:p-10 max-w-2xl mx-auto text-center"
            >
              <div className="h-20 w-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">Demo Scheduled!</h2>
              
              <p className="text-white/80 text-lg mb-8">
                Thank you for your interest. We'll be in touch shortly to confirm your demo time and provide more details.
              </p>
              
              <div className="flex items-center justify-center">
                <RefreshCw className="animate-spin h-5 w-5 text-white/60 mr-3" />
                <span className="text-white/60">Redirecting to homepage...</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-8 max-w-2xl mx-auto"
            >
              {/* Field header */}
              <div className="mb-8">
                <div className={`h-16 w-16 bg-gradient-to-br ${getSectionBackground()} rounded-full flex items-center justify-center shadow-lg mb-4`}>
                  {React.createElement(formFields[currentStep].icon, { size: 24, className: 'text-white' })}
                </div>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {formFields[currentStep].label}
                </h3>
                {formFields[currentStep].required && (
                  <span className="text-xs text-white/60 font-medium bg-white/10 px-2 py-0.5 rounded">Required</span>
                )}
              </div>
              
              {/* Question content */}
              <div className="space-y-3 mb-8">
                {formFields[currentStep].type === 'input' && (
                  <input
                    type={formFields[currentStep].inputType || 'text'}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50"
                    value={answers[formFields[currentStep].id] || ''}
                    onChange={e => handleAnswer(e.target.value)}
                    placeholder={formFields[currentStep].placeholder}
                  />
                )}
                
                {formFields[currentStep].type === 'textarea' && (
                  <textarea
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 min-h-[100px]"
                    value={answers[formFields[currentStep].id] || ''}
                    onChange={e => handleAnswer(e.target.value)}
                    placeholder={formFields[currentStep].placeholder}
                  />
                )}
                
                {formFields[currentStep].type === 'mcq' && (
                  <div className="grid gap-3">
                    {formFields[currentStep].options.map((option) => (
                      <div key={option} className="relative">
                        <button
                          className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                            answers[formFields[currentStep].id] === option
                              ? 'bg-gradient-to-r ' + getSectionBackground() + ' text-white shadow-md'
                              : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
                          }`}
                          onClick={() => handleMCQ(option)}
                          type="button"
                        >
                          <span className="font-medium">{option}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {formFields[currentStep].type === 'multi' && (
                  <div className="space-y-3">
                    <p className="text-white/70 text-sm">
                      Select up to {formFields[currentStep].maxSelections} options
                    </p>
                    <div className="grid gap-3">
                      {formFields[currentStep].options.map((option) => {
                        const isSelected = (answers[formFields[currentStep].id] || []).includes(option);
                        return (
                          <div key={option} className="relative">
                            <button
                              className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                isSelected
                                  ? 'bg-gradient-to-r ' + getSectionBackground() + ' text-white shadow-md'
                                  : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
                              }`}
                              onClick={() => handleMultiSelect(option)}
                              type="button"
                            >
                              <span className="font-medium">{option}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-white/60 text-xs">
                      {((answers[formFields[currentStep].id] || []).length)}/{formFields[currentStep].maxSelections} selected
                    </p>
                  </div>
                )}
              </div>
              
              {/* Error message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-2 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              {/* Navigation buttons */}
              <div className="flex items-center justify-between">
                <button
                  className="flex items-center px-5 py-2 rounded-xl text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10"
                  onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
                  disabled={currentStep === 0 || submitting}
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span>Back</span>
                </button>
                
                <div className="flex-grow text-center text-white/50 text-sm mx-4">
                  {currentStep < totalSteps - 1 ? (
                    <span>Press <kbd className="bg-white/20 px-2 py-0.5 rounded">→</kbd> to continue</span>
                  ) : (
                    <span>Almost done!</span>
                  )}
                </div>
                
                {currentStep < totalSteps - 1 ? (
                  <button
                    className={`flex items-center px-5 py-2 rounded-xl font-medium text-white transition-all duration-200 ${
                      isNextButtonEnabled()
                        ? 'bg-gradient-to-r ' + getSectionBackground() + ' hover:shadow-lg'
                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }`}
                    onClick={() => setCurrentStep((s) => Math.min(s + 1, totalSteps - 1))}
                    disabled={!isNextButtonEnabled() || submitting}
                    type="button"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                ) : (
                  <button
                    className={`flex items-center px-5 py-2 rounded-xl font-medium text-white transition-all duration-200 ${
                      isNextButtonEnabled()
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-lg'
                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }`}
                    onClick={handleSubmit}
                    disabled={!isNextButtonEnabled() || submitting}
                    type="button"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Book Demo</span>
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        <div className="mt-8 text-center text-white/40 text-sm">
          Your information is secure and will only be used to schedule your demo.
        </div>
      </div>
    </motion.section>
  );
};

export default DemoExperience;