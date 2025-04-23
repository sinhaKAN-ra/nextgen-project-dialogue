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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="min-h-screen w-full  relative bg-gradient-to-b from-[#283048] to-[#859398] bg-fixed ">
      {/* Animated radial background blob */}
      <motion.div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,48,72,0.3),rgba(133,147,152,0.3))] mix-blend-overlay pointer-events-none z-0" animate={{ scale: [1,1.05,1] }} transition={{ duration: 12, repeat: Infinity }} />
      <Header />
      <main className="space-y-32">
        <Hero />
        {/* <Workflow /> */}
        <Experience />
        <Features />
        <HowWeDifferent />
        {/* <Testimonials /> */}
        {/* <GetStarted /> */}
      </main>
    </motion.div>
  );
};

export default Index;
