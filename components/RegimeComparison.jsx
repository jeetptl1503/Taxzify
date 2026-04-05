// components/RegimeComparison.jsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const oldRegimeItems = [
  { label: 'Standard Deduction', value: '-₹50,000' },
  { label: '80C Investments', value: '-₹1,50,000' },
  { label: 'HRA', value: '-₹84,000' },
  { label: '80D', value: '-₹25,000' },
];

const newRegimeItems = [
  { label: 'Standard Deduction', value: '-₹75,000' },
  { label: 'No other deductions', value: '—' },
];

export default function RegimeComparison() {
  return (
    <section className="py-20 md:py-28 px-6 bg-light-surface dark:bg-dark-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-semibold tracking-tight mb-4">
            Old vs New — Finally Made Clear
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg max-w-xl mx-auto">
            Example for ₹12,00,000 annual income
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Old Regime */}
          <div className="glass-card p-7 border-t-4 border-t-amber-500">
            <div className="mb-6">
              <span className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Old Regime
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {oldRegimeItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">
                    {item.label}
                  </span>
                  <span className="font-medium tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-light-border dark:border-dark-border space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-light-text-secondary dark:text-dark-text-secondary">
                  Taxable Income
                </span>
                <span className="font-semibold tabular-nums">₹6,91,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Estimated Tax
                </span>
                <span className="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
                  ₹62,880
                </span>
              </div>
            </div>
          </div>

          {/* New Regime */}
          <div className="glass-card p-7 border-t-4 border-t-accent relative overflow-hidden">
            {/* Recommended Badge */}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                RECOMMENDED
              </span>
            </div>

            <div className="mb-6">
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                New Regime
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {newRegimeItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">
                    {item.label}
                  </span>
                  <span className="font-medium tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-light-border dark:border-dark-border space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-light-text-secondary dark:text-dark-text-secondary">
                  Taxable Income
                </span>
                <span className="font-semibold tabular-nums">₹11,25,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  Estimated Tax
                </span>
                <span className="text-2xl font-bold tabular-nums text-accent">
                  ₹45,000
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  You Save
                </span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  ₹17,880 more
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2,
          }}
          className="text-center mt-8"
        >
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-5">
            This is illustrative. Your actual savings depend on your profile.
            Sign up for a personalized comparison.
          </p>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 bg-accent hover:bg-blue-600 text-white font-medium rounded-full px-6 py-3 text-sm transition-colors"
          >
            Get My Personal Comparison
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
