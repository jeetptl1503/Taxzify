// components/FooterCTA.jsx
'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function FooterCTA() {
  return (
    <footer>
      {/* CTA Section */}
      <section id="waitlist" className="py-20 md:py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Be the First to Know
              <br />
              When We Launch
            </h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg mb-8">
              Join 2,400+ Indians already on the waitlist.
            </p>

            {/* Formspree Form */}
            {/* Replace YOUR_FORM_ID with your actual Formspree form ID */}
            <form
              action="https://formspree.io/f/YOUR_FORM_ID"
              method="POST"
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-blue-600 text-white font-medium rounded-full px-7 py-3 text-sm transition-colors flex-shrink-0"
              >
                Join Waitlist
              </button>
            </form>

            {/* Trust Micro-Badges */}
            <div className="flex items-center justify-center gap-6 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              <span>🔒 No spam</span>
              <span>✓ Free forever</span>
              <span>🇮🇳 Made in India</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Bar */}
      <div className="border-t border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-1.5 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>© 2025 Taxzify. All rights reserved.</span>
          </div>

          {/* Center */}
          <div className="flex items-center gap-6 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            <a href="#" className="hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors">
              Contact
            </a>
          </div>

          {/* Right */}
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Built with ❤️ for India&apos;s taxpayers
          </p>
        </div>
      </div>
    </footer>
  );
}
