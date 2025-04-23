import React, { useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import ROICalculator from "./ROICalulator";

const featuresData = [
  {
    id: 1,
    title: "Input Once, Report Everywhere",
    description: "Upload documents, emails, or meeting notes in any format. Our AI transforms raw data into structured insights for any department.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    department: "All Departments",
    benefit: "85% reduction in data entry",
  },
  {
    id: 2,
    title: "Department-Specific AI Agents",
    description: "Specialized AI agents for HR, Legal, Compliance, Finance, and Project Management that understand your industry's terminology and requirements.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    department: "Cross-Functional",
    benefit: "Tailored insights for each team",
  },
  {
    id: 3,
    title: "Risk & Compliance Monitoring",
    description: "Continuous AI monitoring identifies potential compliance issues, regulation changes, and operational risks before they become problems.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    department: "Legal & Compliance",
    benefit: "63% faster risk identification",
  },
  {
    id: 4,
    title: "Team Performance Analytics",
    description: "Track team sentiment, productivity trends, and resource allocation. Identify bottlenecks and morale issues before they impact results.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="2" x2="6" y2="4"></line>
        <line x1="10" y1="2" x2="10" y2="4"></line>
        <line x1="14" y1="2" x2="14" y2="4"></line>
      </svg>
    ),
    department: "HR & Management",
    benefit: "42% improved retention",
  },
  {
    id: 5,
    title: "Financial Forecasting & Reporting",
    description: "Transform financial data into actionable forecasts and automated reports. Identify spending patterns and cost-saving opportunities.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    department: "Finance",
    benefit: "25% cost reduction identified",
  },
  {
    id: 6,
    title: "Executive Decision Dashboard",
    description: "One-click generation of executive-ready reports combining insights from all departments. Make informed decisions faster.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
    ),
    department: "Leadership",
    benefit: "72% faster decision-making",
  },
];

// Department color mapping
const departmentColors = {
  "All Departments": "from-blue-400 to-purple-400",
  "Cross-Functional": "from-indigo-400 to-blue-400",
  "Legal & Compliance": "from-red-400 to-orange-400",
  "HR & Management": "from-green-400 to-teal-400",
  "Finance": "from-yellow-400 to-amber-400",
  "Leadership": "from-purple-400 to-pink-400"
};

const Features = () => {
  const observerRef = useRef(null);
  
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
    <motion.section 
      id="features" 
      initial={{ opacity: 0, y: 50 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, amount: 0.3 }} 
      transition={{ duration: 0.8 }} 
      className="py-28 relative overflow-hidden"
    >
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-40 h-4 bg-gradient-to-r from-[#9a9ea9] to-[#b4c5cb] rounded-full opacity-80 animate-gradient-x mb-8" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-[#7f5fff] to-[#32c5ff] rounded-full opacity-80 animate-pulse mb-10" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-[#32c5ff] to-[#ff6fd8] rounded-full opacity-70 mb-8" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-block reveal">
            <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-400 to-purple-400 rounded-full">
              The Problem
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-4xl reveal">
            No More Manual Reporting
          </h2>
          <p className="text-lg text-white/90 reveal max-w-2xl mx-auto">
            Businesses lose 20+ hours per week on manual reporting across departments. Scattered data, inconsistent formats, and delayed insights cost you time and money.
          </p>
          <p className="text-lg text-white/90 reveal max-w-2xl mx-auto">
            Our AI-powered platform eliminates report creation busywork, uncovers hidden insights, and delivers department-specific analytics automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-2xl transition-all duration-300 reveal flex flex-col items-center text-center h-full"
            >
              <div className={`w-12 h-12 rounded-md bg-gradient-to-r ${departmentColors[feature.department]} flex items-center justify-center text-white mb-4`}>
                {feature.icon}
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-600 text-white mb-3">
                {feature.department}
              </span>
              <h3 className="text-xl text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white mb-4 flex-grow">{feature.description}</p>
              <div className={`rounded-full px-3 py-1 inline-block text-xs font-medium bg-gradient-to-r ${departmentColors[feature.department]}`}>
                {feature.benefit}
              </div>
            </div>
          ))}
        </div>
        
        {/* ROI Calculator Section */}
        <div className="mt-16 bg-white/20 backdrop-blur-sm rounded-xl p-8 border border-white/20 max-w-4xl mx-auto reveal">
          {/* <h3 className="text-2xl font-bold text-white mb-6 text-center">Calculate Your Department's ROI</h3> */}
          <ROICalculator />

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Department Size:</span>
                  <div className="flex space-x-2">
                    <button className="w-8 h-8 rounded bg-white/10 text-white flex items-center justify-center">5</button>
                    <button className="w-8 h-8 rounded bg-white/5 text-white/70 flex items-center justify-center">10</button>
                    <button className="w-8 h-8 rounded bg-white/5 text-white/70 flex items-center justify-center">25+</button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white">Department:</span>
                  <select className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white">
                    <option>HR</option>
                    <option>Legal</option>
                    <option>Finance</option>
                    <option>Compliance</option>
                    <option>Project Management</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white">Current Reporting Hours/Week:</span>
                  <select className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white">
                    <option>10-15 hours</option>
                    <option>16-25 hours</option>
                    <option>26+ hours</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-6 flex flex-col justify-center">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/80">Hours Saved Monthly:</span>
                  <span className="text-white font-bold">160 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Cost Savings Monthly:</span>
                  <span className="text-white font-bold">$12,800</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Risk Reduction:</span>
                  <span className="text-white font-bold">42%</span>
                </div>
                <div className="h-px bg-white/20 my-3"></div>
                <div className="flex justify-between">
                  <span className="text-white font-medium">Annual ROI:</span>
                  <span className="text-white font-bold text-xl">547%</span>
                </div>
              </div>
              
              <button className="mt-6 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
                Get Your Custom ROI Report
              </button>
            </div>
          </div> */}
          
          <p className="text-center text text-sm mt-6 bg-white rounded-xl p-4">
            ✓ Eliminate manual reporting tasks ✓ Uncover hidden operational insights ✓ Make faster, data-driven decisions
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default Features;