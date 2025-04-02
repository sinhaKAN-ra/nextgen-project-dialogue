import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, CheckCircle, BarChart, MessageSquare, LucideIcon } from "lucide-react";

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
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block reveal">
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Live Demo
            </span>
          </div>
          <h2 className="text-3xl text-white/90 md:text-4xl font-bold tracking-tight reveal">
            See the AI in Action
          </h2>
          <p className="text-lg text-white/70 reveal">
            Watch how our AI transforms your project management workflow
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Steps */}
          <div className="space-y-8">
            {demoSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`relative p-6 rounded-xl border transition-all duration-300 ${
                  currentStep === index
                    ? "bg-white/10 border-blue-500/50"
                    : "bg-white/5 border-white/10"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    currentStep === index ? "bg-blue-500/20" : "bg-white/10"
                  }`}>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                      {React.createElement(step.icon, { className: "w-8 h-8 text-blue-400" })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-white/70 text-sm mb-4">{step.description}</p>
                    
                    <AnimatePresence>
                      {currentStep === index && showComparison && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                              <p className="text-red-400 text-sm font-medium mb-1">Before</p>
                              <p className="text-white/70 text-sm">{step.before}</p>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                              <p className="text-green-400 text-sm font-medium mb-1">After</p>
                              <p className="text-white/70 text-sm">{step.after}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Demo Area */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="aspect-video bg-black/40 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                    {React.createElement(demoSteps[currentStep].icon, { className: "w-8 h-8 text-blue-400" })}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {demoSteps[currentStep].title}
                  </h3>
                  <p className="text-white/70">
                    {demoSteps[currentStep].description}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {demoSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentStep(index);
                        setShowComparison(false);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentStep === index ? "bg-blue-400" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                >
                  {showComparison ? "Hide Comparison" : "Show Comparison"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoExperience; 