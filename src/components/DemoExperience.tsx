import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, CheckCircle, BarChart, MessageSquare, LucideIcon, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

interface DemoStep {
  id: number;
  title: string;
  description: string;
  before: string;
  after: string;
  icon: LucideIcon;
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: "Project Document Analysis",
    description: "Upload your project document and watch AI analyze requirements in real-time",
    before: "Manual document review takes 2-3 hours",
    after: "AI analysis completes in 2-3 minutes",
    icon: FileText,
  },
  {
    id: 2,
    title: "Task Breakdown",
    description: "AI automatically creates detailed task breakdowns with assignments",
    before: "Manual task creation takes 1-2 hours",
    after: "AI generates tasks in 30 seconds",
    icon: CheckCircle,
  },
  {
    id: 3,
    title: "Progress Updates",
    description: "Team members update progress in natural language",
    before: "Status meetings take 1 hour weekly",
    after: "Natural updates take 2-3 minutes daily",
    icon: MessageSquare,
  },
  {
    id: 4,
    title: "Report Generation",
    description: "AI generates comprehensive reports automatically",
    before: "Manual report writing takes 2-3 hours",
    after: "AI generates reports in 1 minute",
    icon: BarChart,
  },
];

const DemoExperience: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [started, setStarted] = useState(false);
  const totalSteps = demoSteps.length;

  // Progress bar width calculation
  const progressWidth = `${((currentStep + 1) / totalSteps) * 100}%`;

  return (
    <motion.section initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }} className="min-h-[80vh] py-32 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-[#283048] to-[#859398] rounded-full opacity-80 animate-gradient-x mb-8" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl pointer-events-none z-0" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg pointer-events-none" style={{ zIndex: 0 }} />
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center">

        {/* Progress Indicator */}
        {started && (
          <div className="w-full max-w-md mb-8">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/70 transition-all duration-500" style={{ width: progressWidth }} />
            </div>
            <div className="flex justify-between text-xs text-white/70 mt-1">
              {demoSteps.map((step, idx) => (
                <span key={step.id} className={idx === currentStep ? 'font-bold text-white' : ''}>●</span>
              ))}
            </div>
          </div>
        )}

        {/* Card Content */}
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="start-demo"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-16 max-w-3xl w-full mx-auto flex flex-col items-center text-center"
            >
              <span className="mb-2 px-4 py-1 bg-white/50 text-slate-800 rounded-full font-semibold text-xs tracking-wide  bg-gradient-to-r from-blue-400 to-purple-400">Live Product Demo</span>
              <h2 className="lg:text-6xl tracking-tighter text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#283048] to-[#555f62] mb-8 text-center drop-shadow-2xl">
                Experience the Change</h2>
              <p className="text-white/80 text-lg mb-8">
              See how fast and easy it is to analyze documents, break down tasks, and generate reports with AI.</p>
              <button
                className="bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition-all text-lg"
                onClick={() => setStarted(true)}
              >
                Start
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-xl p-10 max-w-xl mx-auto flex flex-col items-center text-center border border-white/20 hover:scale-105 transition-transform duration-300"
            >
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full  bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg">
                {React.createElement(demoSteps[currentStep].icon, { size: 36, className: 'text-white ' })}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 drop-shadow-lg">{demoSteps[currentStep].title}</h3>
              <p className="text-slate-800/80 text-lg mb-4 font-medium">{demoSteps[currentStep].description}</p>
              <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 rounded-xl px-4 py-2 text-white font-semibold shadow hover:shadow-lg transition-all">
                  <span className="block text-xs font-bold uppercase mb-1">Before</span>
                  <span>{demoSteps[currentStep].before}</span>
                </div>
                <div className="bg-slate-800/90 rounded-xl px-4 py-2 text-white font-semibold shadow hover:shadow-lg transition-all">
                  <span className="block text-xs font-bold uppercase mb-1">After</span>
                  <span>{demoSteps[currentStep].after}</span>
                </div>
              </div>
              <div className="flex gap-6 mt-8">
                <button
                  className="flex items-center justify-center px-6 py-2 rounded-full bg-white/70 text-slate-800 font-bold shadow hover:bg-white/90 transition-all disabled:opacity-50"
                  onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-2">Back</span>
                </button>
                {currentStep < demoSteps.length - 1 ? (
                  <button
                    className="flex items-center justify-center px-6 py-2 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold shadow hover:opacity-90 transition-all"
                    onClick={() => setCurrentStep((s) => Math.min(s + 1, demoSteps.length - 1))}
                  >
                    <span className="mr-2">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center px-6 py-2 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold shadow hover:opacity-90 transition-all"
                    onClick={() => {
                      setStarted(false)
                      setCurrentStep(0)
                    }}
                  >
                    <span className="mr-2">Restart</span>
                    <RefreshCw className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default DemoExperience;