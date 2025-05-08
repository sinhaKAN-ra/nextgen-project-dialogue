import React from "react";
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Mail, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    // <footer className="relative bg-black/50 backdrop-blur-lg border-t border-white/10">

     <motion.footer 
      initial={{ opacity: 0, y: 50 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, amount: 0.3 }} 
      transition={{ duration: 0.5 }} 
      className="relative bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12 overflow-hidden"
    > 
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none z-0"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7f5fff] to-[#32c5ff]"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 ">
          {/* Company info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7f5fff] to-[#32c5ff]">
                  nomore.report
                </span>
              </div>
              <p className="text-sm text-white/70 mb-6 max-w-xs">
                AI-powered SaaS platform for business reporting and decision-making across all departments.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {/* <Mail className="h-4 w-4 text-[#7f5fff]" />
                <a href="mailto:contact@nomore.report" className="text-sm text-white/80 hover:text-white transition-colors">
                  contact@nomore.report
                </a> */}
              </div>
              <div className="flex items-center space-x-4">
                <a href="https://x.com/nomoreReport" className="p-2 bg-white/10 rounded-full hover:bg-[#7f5fff]/20 hover:text-[#7f5fff] transition-all">
                  <X className="h-4 w-4" />
                </a>
                <a href="https://linkedin.com/company/nomore-report" className="p-2 bg-white/10 rounded-full hover:bg-[#7f5fff]/20 hover:text-[#7f5fff] transition-all">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Legal */}
          <div className="space-y-4 md:flex md:justify-end">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">Legal</h4>
              <ul className="space-y-3">
                {[
                  { label: "Terms of Service", href: "terms-of-service" },
                  { label: "Privacy Policy", href: "privacy-policy" },
                  { label: "Cookie Policy", href: "cookie-policy" },
                ].map((item, i) => (
                  <li key={i}>
                    <Link to={`/${item.href}`} className="text-white/70 hover:text-[#32c5ff] transition-colors text-sm">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/40 text-sm">
              © {currentYear} MissionControl.AI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white/40 hover:text-white/60 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/40 hover:text-white/60 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/40 hover:text-white/60 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;