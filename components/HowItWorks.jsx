// components/HowItWorks.jsx
'use client';

import { motion } from 'framer-motion';
import { User, Cpu, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: User,
    number: '01',
    title: 'Tell Us About Yourself',
    description:
      'Share your income type, investments, and life situation. Takes under 3 minutes.',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'We Map Your Eligibility',
    description:
      'Our engine cross-references 200+ deductions, exemptions, and schemes against your exact profile.',
  },
  {
    icon: TrendingUp,
    number: '03',
    title: 'You Optimize and Save',
    description:
      'Get a personalized action plan showing exactly what to claim, apply for, and switch to.',
  },
];

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

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 px-6 bg-light-surface dark:bg-dark-surface"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-semibold tracking-tight mb-4">
            Up and Running in 3 Steps
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg max-w-xl mx-auto">
            No complex setup. No learning curve. Just results.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5 relative"
        >
          {/* Dashed connecting line for desktop */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px border-t-2 border-dashed border-light-border dark:border-dark-border" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative text-center"
              >
                {/* Large faint step number */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-8xl font-bold text-accent/[0.06] dark:text-accent/[0.1] select-none pointer-events-none">
                  {step.number}
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed max-w-xs mx-auto">
                    {step.description}
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
