import { MessageCircle, Send, Zap, Command, Gauge, GitBranch } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WaitlistComponent from "./WaitlistComponent";

const Hero: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [count, setCount] = useState(250);
  const [showWaitlist, setShowWaitlist] = useState(false);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observerRef.current?.observe(el));

    const interval = setInterval(() => {
      setCount(prev => {
        if (prev < 500) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 6000);

    return () => {
      revealElements.forEach((el) => observerRef.current?.unobserve(el));
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
      {/* Space-themed background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0B1026] to-[#2B4365] opacity-90 z-0"></div>

      {/* Star field effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Command center glow effects */}
      <motion.div 
        className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15"
        animate={{ y: [0, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Mission Control Text */}
          <div className="space-y-8">
            <motion.div
              className="space-y-4 reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Command className="h-5 w-5 text-cyan-400" />
                <span className="px-3 py-1 text-xs font-medium bg-cyan-400/20 text-cyan-400 rounded-full">
                  Mission Control for Business
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-2xl mb-6">
                Your Business.<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] via-[#00A3FF] to-[#0057FF] animate-gradient-x">
                  One Command Center.
                </span>
              </h1>
              <p className="mt-4 mb-8 text-lg md:text-2xl text-white/90 font-medium max-w-xl mx-auto drop-shadow">
                Connect your tools. Monitor everything. Make decisions faster. Your complete business command center that brings all your data and tools into one unified dashboard.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWaitlist(true)}
                className="px-8 py-4 rounded-full font-semibold text-lg shadow-xl bg-gradient-to-r from-[#00F0FF] to-[#0057FF] hover:from-[#0057FF] hover:to-[#00F0FF] text-white transition-all duration-200 ring-2 ring-cyan-400/30 ring-offset-2 ring-offset-[#0B1026] flex items-center justify-center gap-2"
              >
                <Command className="h-5 w-5" />
                Launch Mission Control
              </motion.button>
            </motion.div>

            <motion.div
              className="text-white/70 text-sm flex items-center gap-4 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-cyan-400" />
                Real-time monitoring
              </span>
              <span className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-cyan-400" />
                Connect any tool
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                Instant insights
              </span>
            </motion.div>
          </div>

          {/* Right Column: Command Center Interface */}
          <motion.div
            className="space-y-4 bg-[#0B1026]/80 backdrop-blur-xl rounded-xl border border-cyan-500/20 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-cyan-400 text-sm font-mono">System Status: Online</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0">
                  <Command className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="bg-white/5 rounded-lg p-3 text-sm text-white border border-cyan-500/20">
                  "Show me the current status of all connected systems and highlight any anomalies."
                </div>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-white" />
                </div>
                <div className="bg-[#0B1026] rounded-lg p-4 text-sm border-l-2 border-cyan-500">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-white/90">
                      <span>CRM Status</span>
                      <span className="text-green-400">98% Operational</span>
                    </div>
                    <div className="flex justify-between items-center text-white/90">
                      <span>Financial Systems</span>
                      <span className="text-yellow-400">Warning: 2 Updates Pending</span>
                    </div>
                    <div className="flex justify-between items-center text-white/90">
                      <span>Team Productivity</span>
                      <span className="text-cyan-400">↑ 15% This Week</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-full px-4 py-2 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Command size={20} className="text-cyan-400" />
              <input
                type="text"
                disabled
                placeholder="Enter command..."
                className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
              />
              <Send size={20} className="text-cyan-400" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <AnimatePresence>
        {showWaitlist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowWaitlist(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <WaitlistComponent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;