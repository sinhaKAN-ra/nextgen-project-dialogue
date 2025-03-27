
import React, { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import GetStarted from "@/components/GetStarted";
import Footer from "@/components/Footer";

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
    <div className="overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <GetStarted />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
