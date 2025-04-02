import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Project Manager at TechCorp",
    image: "https://i.pravatar.cc/150?img=1",
    content: "This AI-powered platform has completely transformed how we manage projects. We've cut our reporting time by 80% and our team is more productive than ever.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Scrum Master at AgileFlow",
    image: "https://i.pravatar.cc/150?img=2",
    content: "The natural language updates and automatic task breakdowns have made our sprints much more efficient. It's like having an extra team member.",
    rating: 5,
  },
  {
    name: "Emily Thompson",
    role: "Product Owner at InnovateCo",
    image: "https://i.pravatar.cc/150?img=3",
    content: "The AI's ability to analyze requirements and create detailed tasks is impressive. It saves us countless hours of manual work.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Development Lead at CodeCraft",
    image: "https://i.pravatar.cc/150?img=4",
    content: "We've reduced our status meetings from weekly to bi-weekly, and the AI-generated reports are more comprehensive than our manual ones.",
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-blue-900 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block reveal">
            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl text-white/90 md:text-4xl font-bold tracking-tight reveal">
            Loved by Project Teams
          </h2>
          <p className="text-lg text-white/70 reveal">
            See what early adopters are saying about our AI-powered platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative"
            >
              <Quote className="w-8 h-8 text-blue-400/50 absolute -top-4 -left-4" />
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-white font-semibold">{testimonial.name}</h3>
                  <p className="text-white/70 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-white/70 text-sm mb-4">{testimonial.content}</p>
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Time Saved", value: "80%" },
            { label: "Teams Using", value: "50+" },
            { label: "Projects Managed", value: "200+" },
            { label: "Customer Satisfaction", value: "98%" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 