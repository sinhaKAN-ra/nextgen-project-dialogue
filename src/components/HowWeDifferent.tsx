import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X, Clock, BarChart, Shield, Users, FileText, PenTool } from "lucide-react";
import WaitlistComponent from './WaitlistComponent';
import { useNavigate } from 'react-router-dom';

const comparisonData = [
  {
    feature: "Document & Data Processing",
    traditional: "Manual uploads across multiple platforms, format limitations",
    ourSolution: "Upload any document or data source with AI-powered automated processing",
    icon: FileText
  },
  {
    feature: "Cross-Department Insights",
    traditional: "Siloed information, difficult to connect HR, Legal, Finance data",
    ourSolution: "AI analyzes data across departments for comprehensive insights",
    icon: BarChart
  },
  {
    feature: "Compliance & Risk Management",
    traditional: "Manual checks, easy to miss critical compliance issues",
    ourSolution: "Automated risk identification and compliance monitoring",
    icon: Shield
  },
  {
    feature: "Team Performance Analysis",
    traditional: "Subjective assessments, delayed feedback loops",
    ourSolution: "Real-time team morale tracking and performance optimization",
    icon: Users
  },
  {
    feature: "Automated Reporting",
    traditional: "Hours spent manually creating reports for different stakeholders",
    ourSolution: "One-click, customized reports for any audience or department",
    icon: PenTool
  },
  {
    feature: "Decision Intelligence",
    traditional: "Decisions based on outdated or incomplete information",
    ourSolution: "AI-powered recommendations based on real-time operational data",
    icon: Clock
  },
];

// Department-specific ROI data
const departmentROI = [
  { dept: "HR", metric: "Employee Satisfaction", improvement: "+24%" },
  { dept: "Legal", metric: "Compliance Issues", improvement: "-35%" },
  { dept: "Finance", metric: "Reporting Time", improvement: "-68%" },
  { dept: "Project Management", metric: "On-time Delivery", improvement: "+42%" },
  { dept: "Operations", metric: "Process Efficiency", improvement: "+37%" },
  { dept: "Executive", metric: "Decision Speed", improvement: "+58%" },
];

const HowWeDifferent = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const navigate = useNavigate();
  return (
    <motion.section 
    id="difference"
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
      
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block">
            <span className="px-3 py-1 text-xs font-medium bg-[#7f5fff]/20 text-[#7f5fff] rounded-full">
              Why Choose Nomore.Report
            </span>
          </div>
          <h2 className="text-3xl text-white md:text-4xl font-bold tracking-tight drop-shadow-2xl">
            <span className="text-[#7f5fff]">No More</span> Manual Reporting. <span className="text-[#32c5ff]">Ever Again.</span>
          </h2>
          <p className="text-lg text-white/70">
            Transform how your business handles projects, team operations, and reporting with our AI-powered platform that delivers cross-department insights automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Traditional Tools */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-2 p-2 bg-red-500/20 rounded-lg">
                <X className="w-5 h-5 text-red-400" />
              </span>
              Traditional Business Tools
            </h3>
            <div className="space-y-6">
              {comparisonData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-red-400" />
                    <span className="text-white/80 font-medium">{item.feature}</span>
                  </div>
                  <p className="text-white/50 text-sm pl-6">{item.traditional}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Our Solution */}
          <div className="bg-gradient-to-br from-[#7f5fff]/30 to-[#32c5ff]/30 backdrop-blur-sm border border-[#7f5fff]/20 rounded-2xl p-6 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-[#7f5fff] to-[#32c5ff] text-white rounded-full shadow-lg">
                Nomore.Report
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold my-8 text-center drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#7f5fff] to-[#32c5ff]">End-to-End Intelligence</h2>
            <div className="space-y-6">
              {comparisonData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-green-500/20">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-white/90 font-medium">{item.feature}</span>
                  </div>
                  <p className="text-white/70 text-sm pl-8">{item.ourSolution}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Department ROI */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <span className="mr-2 p-2 bg-green-500/20 rounded-lg">
                <BarChart className="w-5 h-5 text-green-400" />
              </span>
              Department-Specific ROI
            </h3>
            <div className="space-y-6">
              {departmentROI.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between py-2 border-b border-white/10"
                >
                  <div>
                    <span className="text-white/80 font-medium">{item.dept}</span>
                    <p className="text-white/50 text-xs">{item.metric}</p>
                  </div>
                  <span className={`text-lg font-bold ${item.improvement.startsWith('+') ? 'text-green-400' : 'text-blue-400'}`}>
                    {item.improvement}
                  </span>
                </motion.div>
              ))}
              <div className="pt-4 mt-4 border-t border-white/20 bg-white/5 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-white/80 mb-2">Average Time Saved Per Week</p>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5 text-[#32c5ff]" />
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7f5fff] to-[#32c5ff]">12+ Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
             onClick={() => window.location.href = '/#experience'}
            className="inline-block mt-10 px-8 py-4 rounded-full font-semibold text-lg shadow-xl bg-gradient-to-r from-[#2E3192] to-[#1BFFFF] hover:from-[#1BFFFF] hover:to-[#2E3192] text-white transition-all duration-200 ring-2 ring-white/30 ring-offset-2 ring-offset-[#2E3192]">
            Get Started
          </motion.button>
        </motion.div>
      </div>

      {/* Waitlist Modal */}
      <AnimatePresence>
        {showWaitlist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
            onClick={() => setShowWaitlist(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <WaitlistComponent onClose={() => setShowWaitlist(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default HowWeDifferent;