import React, { useEffect, useRef } from "react";

const Hero: React.FC = () => {
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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500 to-purple-600 opacity-50 z-0"></div>
      
      {/* Animated background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "1s" }}></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block reveal">
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  Coming Soon
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter reveal">
                AI-Powered
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  Project Management
                </span>
              </h1>
              <p className="text-lg text-white/70 max-w-[600px] reveal stagger-1">
                Revolutionize your workflow with our intelligent project assistant that understands requirements, creates tasks, and communicates with your team.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 reveal stagger-2">
              <button className="px-8 py-3 text-base font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-all hover:shadow-lg focus-ring">
                Join the Waitlist
              </button>
              <button className="px-8 py-3 text-base font-medium text-primary bg-transparent border border-primary rounded-md hover:bg-primary/5 transition-all focus-ring">
                Learn More
              </button>
            </div>
            
            <p className="text-sm text-white/70 reveal stagger-3">
              Currently in private beta with selected partners
            </p>
          </div>
          
          <div className="relative reveal stagger-2">
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl hover-lift">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-500/90 to-blue-700 p-8 flex items-center justify-center">
                <div className="w-full max-w-md glass rounded-lg p-4 md:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-5 bg-white/20 rounded w-3/4"></div>
                      <div className="h-5 bg-white/20 rounded w-1/2"></div>
                      <div className="h-20 bg-white/10 rounded w-full"></div>
                      <div className="flex justify-end">
                        <div className="h-8 bg-blue-600/80 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
