import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Zap, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GetStarted = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWaitlistForm, setShowWaitlistForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setShowWaitlistForm(false);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = () => {
    setShowContactForm(true);
  };

  return (
    <section
      id="get-started"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-900 to-blue-900"
    >
      <div className="container max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full mb-4 reveal">
            Limited Time Offer
          </span>
          <h2 className="text-3xl text-white/90 md:text-4xl font-bold mb-4 reveal">
            Join Now and Skip the Reports Forever
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto reveal">
            Early adopters get exclusive benefits. The first 500 teams receive three months free and founding member status with lifetime discounts.
          </p>
        </div>

        {/* Early Access Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 reveal">
          <div className="bg-card rounded-2xl p-6 shadow-sm hover-lift border border-white/10">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Founding Member Status</h3>
            <p className="text-muted-foreground mb-4">
              Lock in lifetime discounts and get exclusive access to new features.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm hover-lift border border-white/10">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3 Months Free</h3>
            <p className="text-muted-foreground mb-4">
              First 500 teams get three months of free access to all features.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm hover-lift border border-white/10">
            <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Priority Support</h3>
            <p className="text-muted-foreground mb-4">
              Get dedicated support and early access to new AI features.
            </p>
          </div>
        </div>

        {/* Early Access Pricing */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Team Plan</h3>
            <p className="text-white/70 mb-6">For small to medium teams up to 10 members</p>
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-white">$19</span>
              <span className="text-lg text-white/70">/month per user</span>
            </div>
            
            <ul className="space-y-3 mb-6">
              {[
                'All core AI features',
                'Unlimited projects',
                'Priority access to new features',
                'Email + chat support',
                'Custom AI training',
                'Advanced analytics'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-green-400 flex-shrink-0" />
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
            
            <p className="text-white/70 text-sm mb-6">
              <span className="text-yellow-300 font-medium">Limited time:</span> First 3 months free for early access members
            </p>
            
            {submitted ? (
              <div className="text-center p-6 bg-green-50/10 rounded-lg border border-green-500/20">
                <h3 className="text-2xl font-bold text-green-400 mb-4">🎉 Congratulations!</h3>
                <p className="text-green-300">You're on the waiting list. We'll notify you when we're ready!</p>
              </div>
            ) : showWaitlistForm ? (
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 text-white placeholder-white/30 focus:ring-2 focus:ring-white/50 focus:outline-none backdrop-blur-sm"
                />
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
            ) : (
              <Button className="w-full" size="lg" onClick={() => setShowWaitlistForm(true)}>
                Join Waitlist
              </Button>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 border border-white/10 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full opacity-20"></div>
            <span className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </span>
            
            <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
            <p className="text-white/80 mb-6">For larger organizations with complex needs</p>
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-white">Custom</span>
            </div>
            
            <ul className="space-y-3 mb-6">
              {[
                'All Team features',
                'Advanced security & compliance',
                'Custom AI training on company data',
                'Dedicated account manager',
                'Priority 24/7 support',
                'Custom integrations',
                'SLA guarantees'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-white flex-shrink-0" />
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
            
            <p className="text-white/80 text-sm mb-6">
              <span className="text-white font-medium">Founding member status:</span> Lock in preferred pricing forever
            </p>
            
            {showContactForm ? (
              <div className="space-y-4">
                <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
                  <p className="text-white/80 mb-4">Reach out to us at:</p>
                  <a href="mailto:sales@example.com" className="text-blue-400 hover:text-blue-300">sales@example.com</a>
                </div>
                <Button variant="outline" className="w-full border-white hover:bg-white/20" size="lg" onClick={() => setShowContactForm(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full border-white hover:bg-white/20" size="lg" onClick={handleContactClick}>
                Contact Sales
              </Button>
            )}
          </div>
        </div>

        <div className="mt-12 text-center reveal">
          <Link to="/project-board">
            <Button size="lg" className="px-8 py-6 text-base">
              Try Demo Board <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-white/70">
            No credit card required. See the demo board in action before you commit.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;