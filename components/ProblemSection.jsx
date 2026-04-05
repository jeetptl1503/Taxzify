// components/ProblemSection.jsx
'use client';

import { motion } from 'framer-motion';

const stats = [
  {
    number: '72%',
    description: 'of taxpayers never claim all deductions they qualify for',
  },
  {
    number: '₹3.2L Cr',
    description: 'in government subsidies go unclaimed every year',
  },
  {
    number: '1 in 3',
    description: 'professionals choose the wrong tax regime',
  },
  {
    number: '₹30,000+',
    description: 'average annual savings missed per household',
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

export default function ProblemSection() {
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
            Why Most Indians Miss Out
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg max-w-xl mx-auto">
            The system isn&apos;t broken — it&apos;s just invisible to most.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-7 text-center"
            >
              <p className="text-5xl font-bold tabular-nums text-accent mb-3">
                {stat.number}
              </p>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-base leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
