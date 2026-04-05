// components/BenefitShowcase.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { User, Palette, Building2 } from 'lucide-react';

const profiles = [
  {
    icon: User,
    name: 'Priya',
    role: 'Software Engineer',
    income: '₹14L/year',
    benefits: [
      { label: '80C Deduction', amount: '₹1,50,000' },
      { label: '80D Health Insurance', amount: '₹25,000' },
      { label: 'HRA Exemption', amount: '₹84,000' },
      { label: 'New Regime Switch', amount: 'Saves ₹12,400 more' },
    ],
    total: 259000,
    totalDisplay: '₹2,59,000+',
  },
  {
    icon: Palette,
    name: 'Rajan',
    role: 'Freelance Designer',
    income: '₹9L/year',
    benefits: [
      { label: 'Professional Expense Deductions', amount: '₹60,000' },
      { label: '80C Deduction', amount: '₹1,50,000' },
      { label: 'Advance Tax Planning', amount: 'Saves ₹8,200' },
      { label: 'MSME Subsidy', amount: 'Eligible' },
    ],
    total: 210000,
    totalDisplay: '₹2,10,000+',
  },
  {
    icon: Building2,
    name: 'Mehta & Sons',
    role: 'SME Business',
    income: '',
    benefits: [
      { label: 'Startup India Scheme', amount: 'Eligible' },
      { label: 'MUDRA Loan Subsidy', amount: '₹10L' },
      { label: 'GST Input Credit', amount: 'Optimization' },
      { label: 'MSME Tech Upgrade Scheme', amount: 'Eligible' },
    ],
    total: 1400000,
    totalDisplay: '₹14,00,000+',
  },
];

function AnimatedCounter({ target, inView }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1500;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [inView, target]);

  const formatted = new Intl.NumberFormat('en-IN').format(count);
  return <span>₹{formatted}+</span>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function BenefitShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="benefits" className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-semibold tracking-tight mb-4">
            What Taxzify Finds for People Like You
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg max-w-xl mx-auto">
            Real profiles. Real savings discovered.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {profiles.map((profile, index) => {
            const Icon = profile.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-7 flex flex-col"
              >
                {/* Profile Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">{profile.name}</p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                      {profile.role}
                      {profile.income && ` · ${profile.income}`}
                    </p>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="space-y-3 flex-1 mb-5">
                  {profile.benefits.map((benefit, bIndex) => (
                    <div
                      key={bIndex}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-light-text-secondary dark:text-dark-text-secondary">
                        <span className="text-light-text-primary dark:text-dark-text-primary font-medium">
                          {benefit.label}:
                        </span>{' '}
                        {benefit.amount}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-light-border dark:border-dark-border">
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1">
                    Total Identified
                  </p>
                  <p className="text-2xl font-bold text-accent tabular-nums">
                    <AnimatedCounter
                      target={profile.total}
                      inView={isInView}
                    />
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
