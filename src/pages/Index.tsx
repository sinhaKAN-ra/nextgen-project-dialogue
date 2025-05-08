import React, { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import Experience from "@/components/DemoExperience";
import HowWeDifferent from "@/components/HowWeDifferent";
import Testimonials from "@/components/Testimonials";
import GetStarted from "@/components/GetStarted";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import HomePage from "@/components/HomePage";

const Index: React.FC = () => {
  // Initialize reveal animations on scroll
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }} 
      className="min-h-screen w-full relative bg-gradient-to-b from-black via-gray-900 to-blue-950 bg-fixed"
    >
      {/* Space background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Stars */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30" />
        
        {/* Orbital lines */}
        <div className="absolute inset-0">
          <div className="absolute rounded-full border border-blue-500/10 h-[300vh] w-[300vh] left-1/2 top-[50vh]" 
            style={{ transform: 'translate(-50%, -50%) scale(0.3)' }} 
          />
          <div className="absolute rounded-full border border-purple-500/10 h-[200vh] w-[200vh] left-1/2 top-[40vh]" 
            style={{ transform: 'translate(-50%, -50%) scale(0.4)' }} 
          />
          <div className="absolute rounded-full border border-teal-500/10 h-[150vh] w-[150vh] left-1/2 top-[60vh]" 
            style={{ transform: 'translate(-50%, -50%) scale(0.5)' }} 
          />
        </div>

        {/* Glowing orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <Header />
      <main className="relative z-10">
        <Hero/>
        <HomePage />
        <Experience />
        <Features />
        <HowWeDifferent />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
