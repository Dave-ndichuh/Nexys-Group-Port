'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send } from 'lucide-react';

export function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    interest: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmitStatus('success');
    setFormState({ name: '', email: '', interest: '', message: '' });

    setTimeout(() => setSubmitStatus('idle'), 3000);
    setIsSubmitting(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="contact"
      className="min-h-screen py-20 px-6 bg-slate-950 bg-etched relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute -top-24 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="badge-ring mx-auto mb-4 text-slate-200">
              Partnership & Capital
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-100 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-slate-400">
              Have an investment opportunity or partnership idea? We'd love to hear from you.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-6 glass rounded-lg p-8"
          >
            {/* Name & Email Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-slate-900/40 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-colors"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-slate-900/40 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-colors"
                />
              </motion.div>
            </div>

            {/* Interest */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Area of Interest
              </label>
              <select
                name="interest"
                value={formState.interest}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-colors"
              >
                <option value="">Select an area...</option>
                <option value="ai">AI & Software</option>
                <option value="habitats">Smart Habitats</option>
                <option value="engineering">Physical Engineering</option>
                <option value="cultural">Cultural Tech</option>
                <option value="investment">General Investment</option>
              </select>
            </motion.div>

            {/* Message */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
                placeholder="Tell us about your opportunity or idea..."
                rows={5}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 transition-colors resize-none"
              ></textarea>
            </motion.div>

            {/* Submit Button & Status */}
            <motion.div variants={itemVariants} className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 gradient-tech text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-center"
                >
                  Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}
            </motion.div>
          </motion.form>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <p className="text-slate-400">
              Or reach out directly:{' '}
              <a href="mailto:hello@nexusgroup.com" className="text-blue-400 hover:text-blue-300">
                hello@nexusgroup.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
