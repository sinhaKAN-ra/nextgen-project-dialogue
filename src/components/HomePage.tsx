import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, Command, Database, LineChart, Zap, Grid, 
  Globe, Users, BarChart2, FileText, MessageSquare, 
  Briefcase, Box, GitBranch, Shield, Search, 
  Star, Clock, Layers, RefreshCw, Clipboard, Activity
} from "lucide-react";

const HomePage = () => {
  // State for scroll-based animations and effects
  const [scrollY, setScrollY] = useState(0);
  const [starOpacity, setStarOpacity] = useState(0);
  const [parallaxLayers, setParallaxLayers] = useState([]);
  
  // Handle scroll events
  useEffect(() => {
    // Generate random stars for parallax effect
    const generateStars = () => {
      const stars = [];
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.8 + 0.2;
        const delay = Math.random() * 5;
        
        stars.push({ x, y, size, opacity, delay });
      }
      setParallaxLayers(stars);
    };
    
    generateStars();
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Calculate star opacity based on scroll position
      const maxScroll = 500;
      const calculatedOpacity = Math.min(window.scrollY / maxScroll, 1);
      setStarOpacity(calculatedOpacity);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Array of tools that can be integrated
  const tools = [
    { name: "Google Drive", icon: <Database size={20} /> },
    { name: "Salesforce", icon: <Briefcase size={20} /> },
    { name: "Slack", icon: <MessageSquare size={20} /> },
    { name: "Jira", icon: <GitBranch size={20} /> },
    { name: "QuickBooks", icon: <FileText size={20} /> },
    { name: "Workday", icon: <Users size={20} /> },
    { name: "Asana", icon: <Layers size={20} /> },
    { name: "Notion", icon: <Clipboard size={20} /> },
    { name: "Zendesk", icon: <Search size={20} /> },
    { name: "HubSpot", icon: <Globe size={20} /> }
  ];
  
  // Departments that can be unified
  const departments = [
    { name: "Operations", icon: <Grid className="text-blue-400" size={24} /> },
    { name: "Marketing", icon: <Globe className="text-green-400" size={24} /> },
    { name: "Finance", icon: <BarChart2 className="text-yellow-400" size={24} /> },
    { name: "HR", icon: <Users className="text-purple-400" size={24} /> },
    { name: "Legal", icon: <Shield className="text-red-400" size={24} /> },
    { name: "Projects", icon: <GitBranch className="text-indigo-400" size={24} /> },
    { name: "Research", icon: <Search className="text-teal-400" size={24} /> },
    { name: "Client Management", icon: <Briefcase className="text-orange-400" size={24} /> }
  ];
  
  // Benefits of the platform
  const benefits = [
    {
      icon: <Clock className="h-6 w-6 text-[#7f5fff]" />,
      title: "Eliminate Manual Reporting",
      description: "Stop wasting time creating reports. Our platform automatically gathers and interprets data from scattered sources."
    },
    {
      icon: <Zap className="h-6 w-6 text-[#32c5ff]" />,
      title: "Real-Time Metric Monitoring",
      description: "Monitor key business metrics in real-time without switching between multiple tools and dashboards."
    },
    {
      icon: <Activity className="h-6 w-6 text-[#ff6fd8]" />,
      title: "Clarify Planning & Execution",
      description: "Get clear insights into planning, execution, and results without the overhead of building custom dashboards."
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-[#32c5ff]" />,
      title: "Focus On What Matters",
      description: "Spend less time creating reports and more time on strategic decisions that grow your business."
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-blue-950 text-white overflow-hidden">
      {/* Star Background - Appears on scroll */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ opacity: starOpacity }}
      >
        {parallaxLayers.map((star, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white" 
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              transform: `translateY(${scrollY * (i % 5) * 0.05}px)`,
              animation: `twinkle ${3 + star.delay}s infinite alternate ease-in-out`
            }}
          />
        ))}
      </div>
      
      {/* Orbital lines that appear on scroll */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ 
          opacity: starOpacity * 0.7,
        }}
      >
        <div className="absolute rounded-full border border-blue-500/20 h-[300vh] w-[300vh] left-1/2 top-[50vh]" style={{ transform: `translate(-50%, -50%) scale(${0.3 + scrollY * 0.0005})` }} />
        <div className="absolute rounded-full border border-purple-500/20 h-[200vh] w-[200vh] left-1/2 top-[40vh]" style={{ transform: `translate(-50%, -50%) scale(${0.4 + scrollY * 0.0003})` }} />
        <div className="absolute rounded-full border border-teal-500/10 h-[150vh] w-[150vh] left-1/2 top-[60vh]" style={{ transform: `translate(-50%, -50%) scale(${0.5 + scrollY * 0.0008})` }} />
      </div>
      
      {/* Navigation */}
      {/* <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Command className="h-8 w-8 text-blue-400" />
            <span className="font-bold text-xl">MissionControl.AI</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#integrations" className="hover:text-blue-400 transition-colors">Integrations</a>
            <a href="#departments" className="hover:text-blue-400 transition-colors">Departments</a>
            <a href="#benefits" className="hover:text-blue-400 transition-colors">Benefits</a>
          </nav>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-full font-medium hover:shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all">
            Get Started
          </button>
        </div>
      </header> */}
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="px-4 py-1 rounded-full bg-blue-900/50 text-blue-300 text-sm font-medium border border-blue-700/50">
                The Future of Business Intelligence
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300"
            >
              Mission Control for Your Business Data
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8"
            >
              Connect all your tools and data sources in one AI command center. 
              Discover insights, generate reports, and make decisions faster with 
              automated cross-department intelligence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-full text-lg font-medium hover:shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all w-full sm:w-auto">
                Launch Your Command Center
              </button>
              {/* <button className="bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/20 transition-all w-full sm:w-auto">
                Book Demo below
              </button> */}
            </motion.div>
          </div>
          
          {/* Floating dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="relative mt-16 max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full transform -translate-y-1/4" />
            <div className="relative bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-gray-800 p-2 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="px-4 py-1 bg-gray-700 rounded text-xs">
                  MissionControl.AI Dashboard
                </div>
                <div className="flex items-center gap-2">
                  <Rocket size={14} />
                </div>
              </div>
              <div className="p-4 grid grid-cols-12 gap-4 bg-gradient-to-b from-gray-900 to-gray-950">
                {/* Sidebar */}
                <div className="col-span-2 bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <div className="space-y-4">
                    {departments.slice(0, 6).map((dept, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                        {dept.icon}
                        <span className="text-xs">{dept.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Main content */}
                <div className="col-span-7 space-y-4">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-blue-900/30">
                      <div className="text-xs text-gray-400">Revenue Projection</div>
                      <div className="text-xl font-bold">$1.45M</div>
                      <div className="text-xs text-green-400">+12.5% from last month</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-purple-900/30">
                      <div className="text-xs text-gray-400">Team Efficiency</div>
                      <div className="text-xl font-bold">87%</div>
                      <div className="text-xs text-green-400">+5.2% improvement</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-teal-900/30">
                      <div className="text-xs text-gray-400">Client Satisfaction</div>
                      <div className="text-xl font-bold">92%</div>
                      <div className="text-xs text-green-400">+3.7% from Q1</div>
                    </div>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 h-32 flex items-center justify-center">
                    <div className="w-full h-full flex items-end">
                      {[35, 45, 30, 60, 75, 50, 65, 85, 70, 90, 80].map((h, i) => (
                        <div key={i} className="h-full flex-1 flex items-end px-0.5">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-sm"
                            style={{ height: `${h}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Data table */}
                  <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
                    <div className="text-xs p-2 bg-gray-800 border-b border-gray-700">Recent Activities</div>
                    <div className="text-xs">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-2 border-b border-gray-800">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                            <span>Activity update from dept {i}</span>
                          </div>
                          <span className="text-gray-500">2h ago</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Right sidebar */}
                <div className="col-span-3 space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="text-xs font-medium mb-2">AI Insights</div>
                    <div className="space-y-2">
                      <div className="text-xs p-2 bg-blue-900/20 rounded border border-blue-900/30">
                        Team morale shows positive trend after last week's all-hands
                      </div>
                      <div className="text-xs p-2 bg-yellow-900/20 rounded border border-yellow-900/30">
                        Project Alpha may miss deadline based on current velocity
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 h-48">
                    <div className="text-xs font-medium mb-2">Department Performance</div>
                    <div className="space-y-2">
                      {departments.slice(0, 4).map((dept, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="text-xs w-16">{dept.name}</div>
                          <div className="h-2 bg-gray-700 rounded-full flex-1 overflow-hidden">
                            <div 
                              className={`h-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-green-500' : idx === 2 ? 'bg-yellow-500' : 'bg-purple-500'}`} 
                              style={{ width: `${70 + idx * 7}%` }}
                            />
                          </div>
                          <div className="text-xs">{70 + idx * 7}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Mission Control Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-950/50 to-transparent z-10" />
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-4"
            >
              <span className="px-4 py-1 rounded-full bg-indigo-900/50 text-indigo-300 text-sm font-medium border border-indigo-700/50">
                Command & Control
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              One Platform for All Your Business Intelligence
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-300"
            >
              Stop hopping between tools and waiting for reports. Our AI-powered command center 
              connects all your business data for instant insights and automated intelligence.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-600/0 group-hover:from-blue-600/10 group-hover:to-blue-600/5 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="bg-blue-500/20 p-3 rounded-lg w-min mb-6">
                  <Command className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Central Command Hub</h3>
                <p className="text-gray-400 mb-6">
                  Connect all your business tools and data sources into one unified platform. 
                  No more switching between apps or hunting for information.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-full bg-blue-900/30 text-blue-300 text-xs">No More App Switching</span>
                  <span className="px-2 py-1 rounded-full bg-blue-900/30 text-blue-300 text-xs">Unified Interface</span>
                </div>
              </div>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-purple-600/5 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="bg-purple-500/20 p-3 rounded-lg w-min mb-6">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-400 mb-6">
                  Our AI analyzes your data across departments to uncover insights, identify trends, 
                  and predict outcomes that humans might miss.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-full bg-purple-900/30 text-purple-300 text-xs">No More Analysts</span>
                  <span className="px-2 py-1 rounded-full bg-purple-900/30 text-purple-300 text-xs">Automatic Insights</span>
                </div>
              </div>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 to-teal-600/0 group-hover:from-teal-600/10 group-hover:to-teal-600/5 transition-all duration-700"></div>
              <div className="relative z-10">
                <div className="bg-teal-500/20 p-3 rounded-lg w-min mb-6">
                  <LineChart className="h-6 w-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Automated Reporting</h3>
                <p className="text-gray-400 mb-6">
                  Generate presentation-ready reports in seconds. Customize for any audience, 
                  from executive summaries to detailed department analyses.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-full bg-teal-900/30 text-teal-300 text-xs">No More Manual Reports</span>
                  <span className="px-2 py-1 rounded-full bg-teal-900/30 text-teal-300 text-xs">One-Click Generation</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Integrations Section */}
      <section id="integrations" className="py-20 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute right-0 top-1/3 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-4"
            >
              <span className="px-4 py-1 rounded-full bg-blue-900/50 text-blue-300 text-sm font-medium border border-blue-700/50">
                Seamless Connections
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Connect Your Existing Tools
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-300"
            >
              Our platform integrates with your favorite business tools, creating a unified 
              command center without disrupting your existing workflows.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900/80 backdrop-blur-md rounded-xl p-8 border border-gray-700/50 relative"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {tools.map((tool, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30 flex flex-col items-center justify-center text-center hover:bg-gray-700/50 transition-all group"
                >
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 rounded-lg mb-3 group-hover:from-blue-900 group-hover:to-purple-900 transition-all">
                    {tool.icon}
                  </div>
                  <span className="text-sm font-medium">{tool.name}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2">
                <span>View All Integrations</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Connection lines */}
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M20,50 C40,30 60,70 80,50" stroke="url(#gradient1)" strokeWidth="0.2" fill="none" strokeDasharray="1,1" />
                <path d="M30,30 C50,50 70,50 90,70" stroke="url(#gradient2)" strokeWidth="0.2" fill="none" strokeDasharray="1,1" />
                <path d="M10,70 C30,50 50,60 70,40" stroke="url(#gradient3)" strokeWidth="0.2" fill="none" strokeDasharray="1,1" />

                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7f5fff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#32c5ff" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#32c5ff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ff6fd8" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff6fd8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7f5fff" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Departments Section */}
      <section id="departments" className="py-20 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute right-0 top-1/3 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-4"
            >
              <span className="px-4 py-1 rounded-full bg-purple-900/50 text-purple-300 text-sm font-medium border border-purple-700/50">
                Unified Departments
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              One Mission Control for All Departments
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-300"
            >
              Connect all your departments under one unified command center. Get real-time insights, 
              automated reports, and cross-department visibility without the complexity.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="bg-gray-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all group"
              >
                <div className="mb-4 p-3 rounded-lg bg-gray-800/50 w-min group-hover:bg-gray-800/80 transition-all">
                  {dept.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{dept.name}</h3>
                <p className="text-gray-400 text-sm">
                  Unified visibility and control for {dept.name.toLowerCase()} operations and data.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="py-20 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute right-0 top-1/3 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-4"
            >
              <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
                Key Benefits
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Stop Wasting Time on Reports
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/80"
            >
              Eliminate the friction of manual reporting and tool-switching. Focus on growing your business, not building dashboards.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="bg-gray-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-white/70">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-950/50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Eliminate Reporting Friction?
            </h2>
            <p className="text-white/80 mb-8">
              Join our waitlist to be among the first to automatically gather data, monitor metrics, and clarify results—without the overhead.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-gradient-to-r from-[#7f5fff] via-[#32c5ff] to-[#ff6fd8] px-8 py-4 rounded-full text-lg font-medium hover:shadow-lg transition-all w-full sm:w-auto">
                Join the Waitlist
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-full text-lg font-medium hover:bg-white/20 transition-all w-full sm:w-auto">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;