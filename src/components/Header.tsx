import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, Menu, X } from 'lucide-react';
import WaitlistComponent from './WaitlistComponent';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Experience', href: '#experience' },
    { name: 'How We Different', href: '#difference' },
  ];

  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <>
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <Command className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Nomore.Report
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-white/80 hover:text-white transition-colors"
              >
                {item.name}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowWaitlist(true)}

              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Get Started
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
        className="md:hidden overflow-hidden bg-black/95 backdrop-blur-lg border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block text-white/80 hover:text-white transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              {item.name}
            </a>
          ))}
          <button 
                        onClick={() => setShowWaitlist(true)}

          className="w-full px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all">
            Get Started
          </button>
        </div>
      </motion.div>

      
    </motion.header>

    {/* Waitlist Modal */}
    <AnimatePresence>
    {showWaitlist && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] overflow-y-auto"
        onClick={() => setShowWaitlist(false)}
      >
        <div className="min-h-screen w-full flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-2xl w-full bg-black/80 border border-white/10 rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWaitlist(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-white/60" />
            </button>
            <WaitlistComponent />
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
  </>
    
  );
};

export default Header;
