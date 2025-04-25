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

// Enhanced survey questions with new additions
const surveyQuestions = [
  // Understanding Time Usage
  {
    id: 1,
    section: "Time Management",
    icon: Clock,
    question: "Which of these takes up the most of your time right now?",
    type: "mcq",
    options: [
      "Gathering updates from teams",
      "Creating reports for stakeholders",
      "Analyzing team performance manually",
      "None of the above"
    ],
  },
  // Current Methods
  {
    id: 2,
    section: "Current Processes",
    icon: FileText,
    question: "How do you currently manage project updates and reporting?",
    type: "mcq",
    options: [
      "Excel/Google Sheets",
      "Dedicated tools like Asana, Jira, Trello",
      "Manual email and team syncs",
      "We don't have a structured system",
      "Other: ___________"
    ],
  },
  // Understanding Confidence in Team Analysis
  {
    id: 3,
    section: "Team Insights",
    icon: Users,
    question: "How confident are you in understanding your team's productivity and morale on an ongoing basis?",
    type: "mcq",
    options: [
      "Very confident",
      "Somewhat confident",
      "Not confident — it's hard to measure",
      "I don't track it currently"
    ],
  },
  // Department Focus
  {
    id: 4,
    section: "Department Analysis",
    icon: BarChart,
    question: "Which department would you most like to analyze and optimize using AI-generated insights?",
    type: "mcq",
    options: [
      "Projects & Delivery",
      "HR & Morale",
      "Finance & Compliance",
      "Legal",
      "I want it across all departments"
    ],
  },
  // Role Understanding
  {
    id: 5,
    section: "Understanding Your Role",
    icon: FileText,
    question: "What is your role in the organization?",
    type: "mcq",
    options: [
      "Founder / CXO",
      "Project Manager",
      "HR / People Ops",
      "Finance / Accounting",
      "Legal / Compliance",
      "Analyst",
      "Other: ___________"
    ],
  },
  // Reporting Frequency
  {
    id: 6,
    section: "Reporting Habits",
    icon: TrendingUp,
    question: "How often do you work with reports or business analysis?",
    type: "mcq",
    options: [
      "Daily",
      "Weekly",
      "Monthly",
      "Rarely",
      "Never"
    ],
  },
  // Pain Points in Reporting
  {
    id: 7,
    section: "Pain Points",
    icon: AlertTriangle,
    question: "What's your biggest struggle with generating reports?",
    type: "mcq",
    options: [
      "Gathering accurate data",
      "Formatting and presentation",
      "Keeping reports updated",
      "Making sense of the data",
      "All of the above"
    ],
  },
  // Feature Validation
  {
    id: 8,
    section: "Feature Validation",
    icon: CheckCircle,
    question: "Which of these features would be most valuable to you? (Select up to 3)",
    type: "multi",
    options: [
      "AI-generated project performance reports",
      "Sentiment/morale analysis of teams",
      "Department-specific audit reports (HR, Finance, etc.)",
      "Suggestions for improvement based on data",
      "Dashboard to monitor team/project health",
      "Cross-department performance comparisons"
    ],
    maxSelections: 3
  },
  // AI Interest
  {
    id: 9,
    section: "AI Potential",
    icon: Zap,
    question: "If an AI agent could do the reporting + analysis and highlight risks before they escalate, would you try it?",
    type: "mcq",
    options: [
      "100% yes",
      "Maybe, I'd like to know more",
      "No, not interested"
    ],
  },
  // Product Fit & Willingness to Pay
  {
    id: 10,
    section: "Product Fit",
    icon: ThumbsUp,
    question: "What would you expect to pay monthly for a tool that saves you 5+ hours of reporting and gives proactive suggestions?",
    type: "mcq",
    options: [
      "Less than $20",
      "$20–$50",
      "$50–$100",
      "More than $100",
      "I wouldn't pay for it"
    ],
  },
  // Beta Testing
  {
    id: 11,
    section: "Beta Testing",
    icon: RefreshCw,
    question: "Would you be open to trying an early version of this tool and shaping its roadmap?",
    type: "mcq",
    options: [
      "Yes, count me in",
      "Maybe, depends on use case",
      "Not right now"
    ],
  },
  // Open Feedback - Insights
  {
    id: 12,
    section: "Open Feedback",
    icon: MessageSquare,
    question: "What's one insight you wish you had regularly about your team or department?",
    type: "input",
    options: [],
  },
  // Open Feedback - Feature Request
  {
    id: 14,
    section: "Data Sources",
    icon: UploadCloud,
    question: "Which sources would you most like to upload or connect for analysis?",
    type: "multi",
    options: [
      "PDF reports",
      "Excel/CSV",
      "Google Sheets/Drive",
      "Notion/Confluence",
      "CRM (Salesforce, HubSpot)",
      "Slack/Teams exports",
      "Other: ___________"
    ],
    maxSelections: 3
  },
  // Integration Preferences
  {
    id: 15,
    section: "Integrations",
    icon: Link,
    question: "How important is native integration with tools you already use?",
    type: "mcq",
    options: [
      "Critical",
      "Nice to have",
      "Neutral",
      "Unnecessary"
    ]
  },
  // Conversational UI Comfort
  {
    id: 16,
    section: "Interaction",
    icon: MessageCircle,
    question: "How comfortable would you be using a chat interface to refine reports and ask follow-up questions?",
    type: "mcq",
    options: [
      "Very comfortable",
      "Somewhat comfortable",
      "Neutral",
      "Prefer traditional dashboards"
    ]
  },
  // Data Security Concerns
  {
    id: 17,
    section: "Security",
    icon: ShieldOff,
    question: "How concerned are you about uploading sensitive business documents to an AI platform?",
    type: "mcq",
    options: [
      "Very concerned",
      "Somewhat concerned",
      "Not concerned"
    ]
  },
  // Desired Analysis Types
  {
    id: 18,
    section: "Analysis Types",
    icon: BarChart2,
    question: "Which analyses would you use most often? (Select up to 3)",
    type: "multi",
    options: [
      "Budget vs. Actual Variance",
      "Trend & Forecasting",
      "Sentiment & Morale Tracking",
      "Skill-Gap Identification",
      "Compliance/Risk Flags",
      "Custom KPI Dashboards"
    ],
    maxSelections: 3
  },
];

const DemoExperience = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [otherInputs, setOtherInputs] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  
  const totalSteps = surveyQuestions.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!started || completed) return;
      
      if (e.key === "ArrowRight" && isNextButtonEnabled()) {
        if (currentStep < surveyQuestions.length - 1) {
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
  }, [started, currentStep, answers, otherInputs, completed]);

  // Handle answer change
  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [surveyQuestions[currentStep].id]: value }));
    // Reset 'other' input if not selected
    if (!value?.toString().includes('Other')) {
      setOtherInputs(prev => ({ ...prev, [surveyQuestions[currentStep].id]: '' }));
    }
  };

  // Handle multi-select for multi type
  const handleMultiAnswer = (option) => {
    const currentQuestion = surveyQuestions[currentStep];
    const prev = answers[currentQuestion.id] || [];
    let newArr;

    if (prev.includes(option)) {
      newArr = prev.filter(o => o !== option);
    } else {
      // Check if max selections is defined and enforced
      if (currentQuestion.maxSelections && prev.length >= currentQuestion.maxSelections && !prev.includes(option)) {
        return; // Don't add if max selections reached
      }
      newArr = [...prev, option];
    }
    
    setAnswers(ans => ({ ...ans, [currentQuestion.id]: newArr }));
    
    // Reset 'other' input if not selected
    if (!newArr.includes('Other: ___________')) {
      setOtherInputs(prev => ({ ...prev, [currentQuestion.id]: '' }));
    }
  };

  // Handle 'other' input change
  const handleOtherInput = (e) => {
    setOtherInputs(prev => ({ ...prev, [surveyQuestions[currentStep].id]: e.target.value }));
  };

  // Check if the next button should be enabled
  const isNextButtonEnabled = () => {
    const currentQuestion = surveyQuestions[currentStep];
    const answer = answers[currentQuestion.id];
    
    // No answer provided
    if (answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0)) {
      return false;
    }
    
    // For MCQ with "Other" option
    if (currentQuestion.type === 'mcq' && answer === 'Other: ___________' && !otherInputs[currentQuestion.id]) {
      return false;
    }
    
    // For multi-select with "Other" option
    if (currentQuestion.type === 'multi' && Array.isArray(answer) && 
        answer.includes('Other: ___________') && !otherInputs[currentQuestion.id]) {
      return false;
    }
    
    return true;
  };

  // Get the answer value for submission (handles 'other')
  const getFinalAnswer = (q) => {
    const ans = answers[q.id];
    const other = otherInputs[q.id];
    
    if (q.type === 'mcq' && ans === 'Other: ___________') {
      return other ? `Other: ${other}` : '';
    }
    
    if (q.type === 'multi' && Array.isArray(ans) && ans.includes('Other: ___________')) {
      return ans
        .filter(item => item !== 'Other: ___________')
        .concat(other ? [`Other: ${other}`] : [])
        .filter(Boolean);
    }
    
    return ans;
  };

  // Submit answers to backend
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    
    try {
      // Build answers with 'other' handled
      const finalAnswers = {};
      for (const q of surveyQuestions) {
        finalAnswers[q.id] = getFinalAnswer(q);
      }
      
      await addSurveyResponse(finalAnswers);
      setCompleted(true);
      
      // Redirect after showing completion message
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
    const section = surveyQuestions[currentStep]?.section || "";
    
    const sectionColors = {
      "Time Management": "from-blue-500 to-purple-600",
      "Current Processes": "from-purple-500 to-pink-600",
      "Team Insights": "from-indigo-500 to-blue-600",
      "Department Analysis": "from-pink-500 to-orange-600",
      "Understanding Your Role": "from-teal-500 to-blue-600",
      "Reporting Habits": "from-green-500 to-teal-600",
      "Pain Points": "from-red-500 to-pink-600",
      "Feature Validation": "from-violet-500 to-purple-600",
      "AI Potential": "from-blue-500 to-indigo-600",
      "Product Fit": "from-emerald-500 to-green-600",
      "Beta Testing": "from-cyan-500 to-blue-600",
      "Open Feedback": "from-purple-500 to-indigo-600",
      "Final Thoughts": "from-indigo-500 to-violet-600"
    };
    
    return sectionColors[section] || "from-blue-500 to-purple-600";
  };

  return (
    <motion.section 
    id="experience"
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, amount: 0.3 }} 
        transition={{ duration: 0.8 }} 
        className="py-32 relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800"
      >
        {/* Branded accent elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-[#7f5fff] to-[#32c5ff] rounded-full opacity-80 animate-pulse mb-10" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-[#32c5ff] to-[#ff6fd8] rounded-full opacity-70 mb-8" />
        {/* <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none z-0"></div> */}
        
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full filter blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/20 to-cyan-500/10 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div> */}
      
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        
        <div className="text-center mb-16">
        <span className="px-3 py-2text-xs font-medium bg-[#7f5fff]/20 text-[#7f5fff] rounded-full">
        nomore.report
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experience the Future of Reporting
          </h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Help us understand your needs while we show you how our AI can transform your workflow
          </p>
        </div>

        {/* Progress bar (only shown when survey started) */}
        {started && !completed && (
          <div className="w-full max-w-2xl mx-auto mb-6">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Question {currentStep + 1} of {totalSteps}</span>
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
                
                <h2 className="text-3xl font-bold text-white">Tell Us About Your Workflow</h2>
                
                <p className="text-white/80 text-lg">
                  Your insights will help us customize the demo experience to show exactly how we can help your team eliminate repetitive reporting tasks.
                </p>
                
                <ul className="flex flex-wrap justify-center gap-4 text-white/70">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" /> 13 Quick Questions</li>
                  <li className="flex items-center"><Clock className="h-4 w-4 text-blue-400 mr-2" /> Takes ~3 Minutes</li>
                  <li className="flex items-center"><Zap className="h-4 w-4 text-yellow-400 mr-2" /> Personalized Demo</li>
                </ul>
                
                <button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-blue-600 transition-all text-lg w-full md:w-auto"
                  onClick={() => setStarted(true)}
                >
                  Start
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
              
              <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
              
              <p className="text-white/80 text-lg mb-8">
                Your responses have been recorded. We're preparing your personalized demo experience.
              </p>
              
              <div className="flex items-center justify-center">
                <RefreshCw className="animate-spin h-5 w-5 text-white/60 mr-3" />
                <span className="text-white/60">Please join our list</span>
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
              {/* Question header */}
              <div className="mb-8">
                <div className={`h-16 w-16 bg-gradient-to-br ${getSectionBackground()} rounded-full flex items-center justify-center shadow-lg mb-4`}>
                  {React.createElement(surveyQuestions[currentStep].icon, { size: 24, className: 'text-white' })}
                </div>
                
                <span className="text-sm font-medium text-white/60 uppercase tracking-wider">
                  {surveyQuestions[currentStep].section}
                </span>
                
                <h3 className="text-2xl font-bold text-white mt-2">
                  {surveyQuestions[currentStep].question}
                </h3>
              </div>
              
              {/* Question content */}
              <div className="space-y-3 mb-8">
                {surveyQuestions[currentStep].type === 'mcq' && (
                  <div className="grid gap-3">
                    {surveyQuestions[currentStep].options.map((option) => (
                      <div key={option} className="relative">
                        <button
                          className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                            answers[surveyQuestions[currentStep].id] === option
                              ? 'bg-gradient-to-r ' + getSectionBackground() + ' text-white shadow-md'
                              : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
                          }`}
                          onClick={() => handleAnswer(option)}
                          type="button"
                        >
                          <span className="font-medium">{option}</span>
                        </button>
                        
                        {option === 'Other: ___________' && answers[surveyQuestions[currentStep].id] === option && (
                          <input
                            className="w-full mt-2 px-4 py-3 rounded-xl bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50"
                            type="text"
                            placeholder="Please specify..."
                            value={otherInputs[surveyQuestions[currentStep].id] || ''}
                            onChange={handleOtherInput}
                            autoFocus
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {surveyQuestions[currentStep].type === 'multi' && (
                  <div className="space-y-3">
                    <p className="text-sm text-white/70">
                      {surveyQuestions[currentStep].maxSelections 
                        ? `Select up to ${surveyQuestions[currentStep].maxSelections} options`
                        : 'Select all that apply'}
                    </p>
                    
                    <div className="grid gap-3">
                      {surveyQuestions[currentStep].options.map((option) => (
                        <div key={option} className="relative">
                          <button
                            className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                              Array.isArray(answers[surveyQuestions[currentStep].id]) &&
                              answers[surveyQuestions[currentStep].id].includes(option)
                                ? 'bg-gradient-to-r ' + getSectionBackground() + ' text-white shadow-md'
                                : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
                            }`}
                            onClick={() => handleMultiAnswer(option)}
                            type="button"
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded mr-3 flex items-center justify-center ${
                                Array.isArray(answers[surveyQuestions[currentStep].id]) &&
                                answers[surveyQuestions[currentStep].id].includes(option)
                                  ? 'bg-white/20'
                                  : 'border border-white/30'
                              }`}>
                                {Array.isArray(answers[surveyQuestions[currentStep].id]) &&
                                 answers[surveyQuestions[currentStep].id].includes(option) && (
                                  <CheckCircle className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <span className="font-medium">{option}</span>
                            </div>
                          </button>
                          
                          {option === 'Other: ___________' && 
                           Array.isArray(answers[surveyQuestions[currentStep].id]) &&
                           answers[surveyQuestions[currentStep].id].includes(option) && (
                            <input
                              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50"
                              type="text"
                              placeholder="Please specify..."
                              value={otherInputs[surveyQuestions[currentStep].id] || ''}
                              onChange={handleOtherInput}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {surveyQuestions[currentStep].type === 'input' && (
                  <textarea
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50 min-h-[120px]"
                    value={answers[surveyQuestions[currentStep].id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    autoFocus
                  />
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
                
                {currentStep < surveyQuestions.length - 1 ? (
                  <button
                    className={`flex items-center px-5 py-2 rounded-xl font-medium text-white transition-all duration-200 ${
                      isNextButtonEnabled()
                        ? 'bg-gradient-to-r ' + getSectionBackground() + ' hover:shadow-lg'
                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }`}
                    onClick={() => setCurrentStep((s) => Math.min(s + 1, surveyQuestions.length - 1))}
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
                        <span>Complete</span>
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
          Your responses help us build a better product. Thanks for your feedback!
        </div>
      </div>
    </motion.section>
  );
};

export default DemoExperience;