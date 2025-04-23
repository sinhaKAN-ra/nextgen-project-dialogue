import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import WaitlistComponent from "./WaitlistComponent";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ease-out-expo",
          scrolled
            ? "bg-black/40 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                nomore.report
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
          <a
              href="/#experience"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="/#features"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Features
            </a>
            
            <a
              href="/#difference"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Difference
            </a>
            {/* <Link
              to="/project-board"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Demo Board
            </Link> */}
            {/* <Link
              to="/chat"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Chat Demo (WS)
            </Link> */}
            {/* <Link
              to="/sse-chat"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Demo (SSE)
            </Link> */}
          </nav>

          <div className="flex items-center space-x-4">
            
            <button 
              onClick={() => setShowWaitlist(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </header>

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
    </>
  );
};

export default Header;
