import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Lock, Mail, ChevronRight, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { addToNewsletter } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

interface WaitlistComponentProps {
  onClose?: () => void;
}

const WaitlistComponent: React.FC<WaitlistComponentProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const [position, setPosition] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize EmailJS with your public key
    emailjs.init('ndFEdP-RZLUEzvJTh');
    
    // Fetch initial waitlist count and subscribe to real-time updates
    const fetchCount = async () => {
      const { count: initialCount, error } = await supabase
        .from('nomore_newsletter')
        .select('*', { count: 'exact', head: true });
      if (!error && initialCount !== null) setCount(initialCount);
    };
    fetchCount();
    // Subscribe to real-time inserts via channel
    const channel = supabase
      .channel('newsletter-waitlist')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'nomore_newsletter' },
        () => setCount(prev => prev + 1)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendWelcomeEmail = async (userEmail: string, position: number) => {
    try {
      const templateParams = {
        email: userEmail,
        position: position,
        total_count: count,
      };

      await addToNewsletter({email: userEmail, position: position, total_count: count});

      await emailjs.send(
        'service_vx2qw7b',
        'template_p23ubg7',
        templateParams
      );
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      setError('Failed to send welcome email. Please try again later.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call to join waitlist
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newPosition = count + 1;
        setSubmitted(true);
        setPosition(newPosition);
        
        // Send welcome email
        await sendWelcomeEmail(email, newPosition);
      } catch (error) {
        setError('Failed to join waitlist. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 shadow-xl border border-blue-100 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
        {/* Header */}
        <div className="mb-6 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 mb-4"
          >
            <Lock className="h-6 w-6 text-white" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
          >
            Join Our Exclusive Waitlist
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-md mx-auto"
          >
            Be among the first to experience our groundbreaking AI solution that eliminates the need for reports and meetings.
          </motion.p>
        </div>
        
        {/* Status indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white backdrop-blur-sm border border-blue-100 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center gap-2 text-gray-800">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-sm font-medium">
              <span className="font-bold">{count}</span> teams on waitlist • <span className="font-bold text-yellow-500">Limited spots available</span>
            </p>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min((count/550) * 100, 100)}%` }}></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>First 500 get 3 months free</span>
            <span>Max 550</span>
          </div>
        </motion.div>
        
        {/* Form or Success message */}
        {!submitted ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Joining...
                  </span>
                ) : (
                  <>
                    Join Waitlist <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <p className="text-xs text-gray-500 text-center">
              ✓ No credit card required &nbsp; ✓ First 500 get 3 months free &nbsp; ✓ Cancel anytime
            </p>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-100 rounded-lg p-6 text-center"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">You're on the list!</h3>
            <p className="text-gray-600 mb-4">Your position: <span className="font-bold">#{position}</span></p>
            <div className="text-sm text-gray-500">
              We've sent a confirmation email to {email}. We'll notify you when it's your turn to access our beta. The sooner you joined, the sooner you'll get access!
            </div>
          </motion.div>
        )}
        
        {/* Testimonials/Social Proof */}
        {/* <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <p className="text-xs text-gray-500 text-center mb-4">Trusted by teams from companies like:</p>
          <div className="flex flex-wrap justify-center gap-4 opacity-60">
            <div className="h-6 text-gray-400 font-bold">ACME Inc</div>
            <div className="h-6 text-gray-400 font-bold">TechStart</div>
            <div className="h-6 text-gray-400 font-bold">FutureWorks</div>
            <div className="h-6 text-gray-400 font-bold">InnoGroup</div>
          </div>
        </motion.div> */}
      </div>
    </div>
  );
};

export default WaitlistComponent;