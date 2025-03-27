
import React, { useEffect, useRef } from "react";

const workflowSteps = [
  {
    id: 1,
    title: "User Login & Role Assignment",
    description: "Users sign in and receive personalized roles based on their expertise.",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E",
  },
  {
    id: 2,
    title: "Project & Document Upload",
    description: "Upload business requirements document for AI analysis.",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='12' y1='18' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='9' y1='15' x2='15' y2='15'%3E%3C/line%3E%3C/svg%3E",
  },
  {
    id: 3,
    title: "AI Task Generation",
    description: "AI analyzes requirements and creates task breakdowns with assignments.",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E",
  },
  {
    id: 4,
    title: "Team Collaboration with AI",
    description: "Team members discuss tasks with AI and update progress in natural language.",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E",
  },
  {
    id: 5,
    title: "Dynamic Task Adjustment",
    description: "AI continuously optimizes tasks based on feedback and progress.",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='23 4 23 10 17 10'%3E%3C/polyline%3E%3Cpolyline points='1 20 1 14 7 14'%3E%3C/polyline%3E%3Cpath d='M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'%3E%3C/path%3E%3C/svg%3E",
  },
  {
    id: 6,
    title: "Automated Report Generation",
    description: "AI generates comprehensive reports on project status and team performance.",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='16' y1='13' x2='8' y2='13'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='8' y2='17'%3E%3C/line%3E%3Cpolyline points='10 9 9 9 8 9'%3E%3C/polyline%3E%3C/svg%3E",
  },
];

const Workflow: React.FC = () => {
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
    <section id="workflow" className="py-24 bg-gradient-to-b from-white to-blue-50 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block reveal">
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Workflow
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight reveal stagger-1">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground reveal stagger-2">
            Our AI-powered platform simplifies project management through an intuitive workflow
          </p>
        </div>

        <div className="relative">
          {/* Central line */}
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
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative p-2 bg-white rounded-xl shadow-lg hover-lift overflow-hidden max-w-sm w-full">
                    {/* Mock UI for each step */}
                    <div className="aspect-[4/3] w-full bg-gradient-to-br from-blue-50 to-white p-8 flex items-center justify-center">
                      <img 
                        src={step.imageUrl} 
                        alt={step.title} 
                        className="w-20 h-20 opacity-80"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
