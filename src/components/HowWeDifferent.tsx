import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const comparisonData = [
  {
    feature: "Task Creation",
    traditional: "Manual task breakdown and assignment",
    ourSolution: "AI analyzes documents and creates tasks automatically",
  },
  {
    feature: "Progress Updates",
    traditional: "Weekly status meetings and manual updates",
    ourSolution: "Natural language updates and real-time AI tracking",
  },
  {
    feature: "Report Generation",
    traditional: "Manual report writing and data collection",
    ourSolution: "AI generates comprehensive reports in seconds",
  },
  {
    feature: "Team Collaboration",
    traditional: "Multiple tools and platforms",
    ourSolution: "Unified AI-powered platform",
  },
  {
    feature: "Time Tracking",
    traditional: "Manual time entry and tracking",
    ourSolution: "AI automatically tracks time from updates",
  },
  {
    feature: "Risk Management",
    traditional: "Manual risk assessment and tracking",
    ourSolution: "AI identifies and tracks risks automatically",
  },
];

const HowWeDifferent: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-blue-900 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block reveal">
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-3xl text-white/90 md:text-4xl font-bold tracking-tight reveal">
            How We're Different
          </h2>
          <p className="text-lg text-white/70 reveal">
            See how our AI-powered platform compares to traditional project management tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Traditional Tools */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Traditional PM Tools</h3>
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
                    <X className="w-5 h-5 text-red-400" />
                    <span className="text-white/70">{item.feature}</span>
                  </div>
                  <p className="text-white/50 text-sm pl-7">{item.traditional}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Our Solution */}
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="px-3 py-1 text-xs font-bold bg-blue-500 text-white rounded-full">
                Our Solution
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-6">AI-Powered Platform</h3>
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
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white/90">{item.feature}</span>
                  </div>
                  <p className="text-white/70 text-sm pl-7">{item.ourSolution}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Time Savings */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Time Savings</h3>
            <div className="space-y-6">
              {[
                { task: "Task Creation", saved: "1.5 hours" },
                { task: "Progress Updates", saved: "1 hour" },
                { task: "Report Writing", saved: "2 hours" },
                { task: "Meeting Time", saved: "1 hour" },
                { task: "Data Collection", saved: "30 minutes" },
                { task: "Risk Assessment", saved: "1 hour" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-white/70">{item.task}</span>
                  <span className="text-green-400 font-medium">{item.saved}</span>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Total Weekly Savings</span>
                  <span className="text-2xl font-bold text-green-400">7 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeDifferent; 