import { MessageCircle, Mic, Zap } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Hero: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navigation = useNavigate();
  const [showName, setShowName] = useState(false);

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

    return () => {
      revealElements.forEach((el) => observerRef.current?.unobserve(el));
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
                  Coming Soon
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                AI-Powered
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  Project Management
                </span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-white/70 max-w-[600px]">
                An AI that understands your project requirements, creates tasks, and communicates with your team.
              </p>
            </motion.div>
            
            <motion.div className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-8 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-all hover:shadow-lg focus-ring">
                Join the Waitlist
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigation("/project-board")}
                className="px-8 py-3 text-base font-medium text-primary bg-transparent border border-primary rounded-md hover:bg-primary/5 transition-all focus-ring">
                Try Now
              </motion.button>
            </motion.div>
          </div>
          
          <motion.div 
            className="relative flex flex-col items-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
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
                    </span> 👋
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
