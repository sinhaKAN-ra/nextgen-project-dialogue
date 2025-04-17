import React, { useEffect, useRef } from "react";
import { motion } from 'framer-motion';

const featuresData = [
  {
    id: 1,
    title: "Eliminate Status Meetings",
    description: "Save 5+ hours weekly by replacing status meetings with AI-powered conversations and automated updates.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    benefit: "30% time savings",
  },
  {
    id: 2,
    title: "Zero-Effort Task Creation",
    description: "Upload requirements and our AI analyzes, creates and assigns tasks based on team roles and capacity.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    benefit: "85% faster planning",
  },
  {
    id: 3,
    title: "Chat-Based Progress Updates",
    description: "Team members simply chat with the AI to update task status - no forms, no reports, no stress.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    benefit: "3 hours saved weekly",
  },
  {
    id: 4,
    title: "Intelligent Workload Balancing",
    description: "AI continuously monitors team capacity and suggests task reallocation to prevent bottlenecks.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
    ),
    benefit: "40% fewer delays",
  },
  {
    id: 5,
    title: "One-Click Executive Reports",
    description: "Generate comprehensive reports for stakeholders with a single click - no more last-minute scrambles.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    benefit: "8 hours saved monthly",
  },
  {
    id: 6,
    title: "Context-Aware Communication",
    description: "AI remembers project history and transforms informal updates into clear, professional communications.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="2" x2="6" y2="4"></line>
        <line x1="10" y1="2" x2="10" y2="4"></line>
        <line x1="14" y1="2" x2="14" y2="4"></line>
      </svg>
    ),
    benefit: "25% better clarity",
  },
];

const Features: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
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
    <motion.section id="features" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }} className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-[#283048] to-[#859398] rounded-full opacity-80 animate-gradient-x mb-8" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-block reveal">
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              The Problem
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-2xl reveal">
            Features That Set Us Apart
          </h2>
          <p className="text-lg text-white/90 reveal max-w-2xl mx-auto">
            Teams waste 40% of time on busy work. Status meetings, report writing, and task management eat up your most productive hours.
          </p>
          <p className="text-lg text-white/90 reveal max-w-2xl mx-auto">
            Discover how our AI-driven platform saves you time, automates your workflow, and keeps your team focused.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-white/20 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-2xl transition-all duration-300 reveal flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-md bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#283048] mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl text-white font-semibold mb-2">{feature.title}</h3>
              <p className=" text-white/80 mb-4">{feature.description}</p>
              <div className="bg-white/60 rounded-full px-3 py-1 inline-block text-xs font-medium">
                {feature.benefit}
              </div>
            </div>
          ))}
        </div>
        
        {/* ROI Calculator Section */}
        <div className="mt-16 bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-w-2xl mx-auto reveal">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">Calculate Your Time Savings</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-white/70 text-sm mb-1">Team Members</p>
                <p className="text-white text-xl font-bold">5</p>
              </div>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-white/70 text-sm mb-1">Hours Saved/Week</p>
                <p className="text-white text-xl font-bold">× 8</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-[#283048] to-[#859398] rounded-lg">
                <p className="text-white/80 text-sm mb-1">Monthly Value</p>
                <p className="text-white text-xl font-bold">160 hrs</p>
              </div>
            </div>
            <p className="text-center text-white/70 text-sm">
              That's equivalent to adding a full-time team member at no extra cost!
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Features;