import { MessageCircle, Send, Zap } from "lucide-react";
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
      {/* Original color theme background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500 to-purple-600 opacity-50 z-0"></div>

      {/* Animated background elements */}
      <motion.div 
        className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ y: [0, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column: Hero Text */}
          <div className="space-y-8">
            <motion.div
              className="space-y-4 reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Early Access
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-6xl font-extrabold tracking-tighter text-white drop-shadow-2xl mb-6">
                Upload.Chat.Reports.<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1BFFFF] via-[#8f2e92] to-[#1BFFFF] animate-gradient-x">
                  Insights Instantly
                </span>
              </h1>
              <p className="mt-4 mb-8 text-lg md:text-2xl text-white/90 font-medium max-w-xl mx-auto drop-shadow">
                Nomore.Report ingests your documents—financials, HR records, legal contracts, project logs—and uses AI to generate comprehensive reports, skill analyses, predictive insights, and actionable recommendations. Say goodbye to manual data wrangling.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 text-white">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-sm font-medium">
                  <span className="font-bold">{count}</span> teams on waitlist – spots filling fast
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWaitlist(true)}
                className="px-8 py-4 rounded-full font-semibold text-lg shadow-xl bg-gradient-to-r from-[#2E3192] to-[#1BFFFF] hover:from-[#1BFFFF] hover:to-[#2E3192] text-white transition-all duration-200 ring-2 ring-white/30 ring-offset-2 ring-offset-[#2E3192]"
              >
                Join the Waitlist
              </motion.button>
            </motion.div>

            <motion.div
              className="text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              ✓ No credit card required &nbsp; ✓ First 500 users get 3 months free &nbsp; ✓ Cancel anytime
            </motion.div>
          </div>

          {/* Right Column: Chat Simulation */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">You</span>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-sm text-white">
                "I've uploaded our Q2 financial statements and recent performance reviews. Can you provide a summary of key insights and strategic recommendations?"
              </div>
            </div>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Zap size={16} className="text-white" />
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-sm border-l-2 border-blue-500">
                Absolutely! Here's what I found:<br />
                • <b>Revenue Variance</b>: 15% above forecast<br />
                • <b>Skill Gaps</b>: Need training in data analytics for 3 team members<br />
                • <b>Compliance Check</b>: Missing NDA clauses in 5 contracts<br />
                Would you like a full formal report or specific department deep dive?
              </div>
            </div>
            <motion.div
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <MessageCircle size={20} className="text-white/70" />
              <input
                type="text"
                disabled
                placeholder="Type your message..."
                className="flex-1 bg-transparent text-white placeholder-white/70 focus:outline-none"
              />
              <Send size={20} className="text-white/70" />
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
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

