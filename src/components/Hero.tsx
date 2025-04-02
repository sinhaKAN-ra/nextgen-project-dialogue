import { MessageCircle, Mic, Zap } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import WaitlistComponent from "./WaitlistComponent";

const Hero: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navigation = useNavigate();
  const [showName, setShowName] = useState(false);
  const [count, setCount] = useState(482);
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

    // Increment counter effect
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev < 500) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 8000);

    return () => {
      revealElements.forEach((el) => observerRef.current?.unobserve(el));
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
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
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        style={{ animationDelay: "1s" }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div 
              className="space-y-4 reveal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block">
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  Limited Access
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                No More Reports.
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  No More Meetings.
                </span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-white/70 max-w-[600px]">
                AI that understands your project, creates tasks, and writes reports so you don't have to.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 text-white">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium">
                  <span className="font-bold">{count}</span> teams on waitlist • <span className="font-bold text-yellow-300">Limited spots available</span>
                </p>
              </div>
            </motion.div>
            
            <motion.div className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWaitlist(true)}
                className="px-8 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-all hover:shadow-lg focus-ring">
                Skip the Reports Queue
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => navigation("/project-board")}
                className="px-8 py-3 text-base font-medium text-primary bg-transparent border border-primary rounded-md hover:bg-primary/5 transition-all focus-ring">
                See AI in Action
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              ✓ No credit card required &nbsp; ✓ First 500 get 3 months free &nbsp; ✓ Cancel anytime
            </motion.div>
          </div>
          
          
            <motion.div 
              className="relative flex flex-col items-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Time Savings Indicator */}
              <div className="absolute top-0 -right-4 bg-green-400 text-gray-900 rounded-full px-4 py-2 text-sm font-bold shadow-lg transform rotate-12 z-20">
                Save 15+ hours weekly
              </div>
              
              {/* AI Assistant Preview */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setShowName(true)}
                onMouseLeave={() => setShowName(false)}
                className="relative z-10 rounded-full overflow-hidden shadow-2xl w-60">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-blue-700 p-8 flex items-center justify-center relative">
                  <motion.div
                    className="absolute w-24 h-24 rounded-full border-4 border-blue-400 opacity-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute w-28 h-28 rounded-full border-4 border-blue-300 opacity-40"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                  <div className="relative w-20 h-20 flex items-center justify-center bg-white rounded-full shadow-lg">
                    <Zap size={40} className="text-blue-500 animate-pulse" />
                  </div>
                </div>
              </motion.div>

              {/* AI Name Reveal Animation */}
              <AnimatePresence>
                {showName && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full mt-4 px-4 py-2 bg-white rounded-lg shadow-lg text-blue-600 text-lg font-semibold"
                  >
                    Meet 
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      Pmai
                    </span> 👋 - Your AI assistant
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Sample chat bubbles */}
              <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">TM</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2 text-sm">
                    "Hey Pmai, can you update me on the landing page project?"
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Zap size={16} className="text-white" />
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-sm border-l-2 border-blue-500">
                    "The landing page is 78% complete. Alex completed the hero section yesterday, and Maria is currently working on responsive styles. Expected completion by Friday."
                  </div>
                </div>
              </div>
            </motion.div>
          
          

        </div>
      </div>
      {/* Modal approach (alternative) */}
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
    </section>
  );
};

export default Hero;