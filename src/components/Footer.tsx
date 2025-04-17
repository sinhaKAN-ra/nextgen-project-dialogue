import React from "react";
import { motion } from 'framer-motion';
import { Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <motion.footer initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.3 }} className="relative bg-gradient-to-b from-[#859398] to-[#283048] text-white py-6 overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg pointer-events-none z-0"></div>
      <div className="relative z-10 container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#283048] to-[#68767d]">
              nomore.report
            </span>
          </div>
          <p className="text-sm text-white/70">
            Revolutionizing project management with AI technology
          </p>
          <div className="flex items-center space-x-4">
            <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all">
              <Twitter className="h-5 w-5 text-white" />
            </a>
            <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all">
              <Linkedin className="h-5 w-5 text-white" />
            </a>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium uppercase tracking-wider text-white">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                Cookie Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative z-10 mt-12 pt-8 border-t border-white/20 text-center">
        <p className="text-xs text-white/70">
          {new Date().getFullYear()} nomore.report. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
