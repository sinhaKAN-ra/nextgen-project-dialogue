import React, { useEffect, useRef, useState } from "react";

const workflowSteps = [
  {
    id: 1,
    title: "One-Time Team Setup",
    description: "Set up your team structure, roles, and project objectives just once - the AI remembers everything.",
    before: "Manual team management and role assignments",
    after: "Automatic role recognition and task matching",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E",
  },
  {
    id: 2,
    title: "Smart Document Processing",
    description: "Upload your business requirements once, and let AI create tasks, estimates, and assignments.",
    before: "Hours spent breaking down documents into tasks",
    after: "Instant task creation from any document format",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='12' y1='18' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='9' y1='15' x2='15' y2='15'%3E%3C/line%3E%3C/svg%3E",
  },
  {
    id: 3,
    title: "Natural Language Updates",
    description: "Team members update progress in plain English - AI handles the rest.",
    before: "Complex status updates and meetings",
    after: "Simple chat-like progress updates",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E",
  },
  {
    id: 4,
    title: "AI-Powered Insights",
    description: "Get real-time insights, predictions, and recommendations from your AI assistant.",
    before: "Manual analysis and reporting",
    after: "Instant AI-driven insights and forecasts",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='20' x2='18' y2='10'%3E%3C/line%3E%3Cline x1='12' y1='20' x2='12' y2='4'%3E%3C/line%3E%3Cline x1='6' y1='20' x2='6' y2='14'%3E%3C/line%3E%3C/svg%3E",
  },
  {
    id: 5,
    title: "Automated Reports",
    description: "AI generates comprehensive reports automatically - no manual work needed.",
    before: "Hours of report writing and formatting",
    after: "One-click professional reports",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='16' y1='13' x2='8' y2='13'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='8' y2='17'%3E%3C/line%3E%3Cpolyline points='10 9 9 9 8 9'%3E%3C/polyline%3E%3C/svg%3E",
  },
  {
    id: 6,
    title: "Continuous Learning",
    description: "AI learns from your team's patterns and improves over time.",
    before: "Static processes and workflows",
    after: "Adaptive, learning system",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2v20M2 12h20'%3E%3C/path%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3C/svg%3E",
  }
];

const Workflow: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="workflow" className="py-24 bg-gradient-to-b from-[#2E3192] to-[#1BFFFF] relative overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block reveal">
            <span className="px-3 py-1 text-xs font-medium bg-white/50 text-[#7f5fff] rounded-full backdrop-blur-sm">
              Workflow
            </span>
          </div>
          <h2 className="text-3xl text-white/90 md:text-4xl font-bold tracking-tight reveal">
            How It Works
          </h2>
          <p className="text-lg text-white/70 reveal">
            Our AI-powered platform simplifies project management through an intuitive workflow.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 hidden md:block"></div>
          
          <div className="space-y-16 relative">
            {workflowSteps.map((step, index) => (
              <div 
                key={step.id} 
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 reveal`}
                style={{ transitionDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {step.id}
                    </div>
                    <h3 className="text-xl font-semibold text-white/70">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative p-2 bg-white rounded-xl shadow-lg hover-lift overflow-hidden max-w-sm w-full">
                    <div className="aspect-[4/3] w-full bg-gradient-to-br from-[#2E3192]/90 to-[#1BFFFF]/80 p-8 flex items-center justify-center">
                      <img 
                        src={step.imageUrl} 
                        alt={step.title} 
                        className="w-20 h-20 opacity-80 bg-white/70 rounded"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Waitlist Section */}
          <div className="mt-16 text-center reveal">
            <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Transform Your Project Management?
              </h3>
              <p className="text-white/70 mb-6">
                Join our waitlist to be among the first to experience AI-powered project management.
                Early access members get 3 months free!
              </p>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-[#2E3192] to-[#1BFFFF] text-white rounded-full font-medium shadow-lg hover:from-[#1BFFFF] hover:to-[#2E3192] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                  </button>
                </form>
              ) : (
                <div className="text-green-400 font-medium">
                  Thanks for joining! We'll be in touch soon.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
