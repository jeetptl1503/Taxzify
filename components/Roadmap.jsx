// components/Roadmap.jsx
'use client';

import { motion } from 'framer-motion';

const phases = [
  {
    phase: 'Phase 1',
    label: 'LIVE',
    title: 'Core Platform Launch',
    description: 'Benefit discovery, regime comparison, subsidy mapping',
    active: true,
  },
  {
    phase: 'Phase 2',
    label: 'LIVE',
    title: 'AI Layer',
    description: 'Predictive savings, smart optimization engine',
    active: true,
  },
  {
    phase: 'Phase 3',
    label: 'LIVE',
    title: 'Investment Module',
    description: 'Investment-linked tax optimization',
    active: true,
  },
  {
    phase: 'Phase 4',
    label: 'LIVE',
    title: 'Business Suite',
    description: 'Compliance dashboards, GST optimization',
    active: true,
  },
  {
    phase: 'Phase 5',
    label: 'COMING SOON',
    title: 'National Scale',
    description: 'Cross-border taxation, real-time policy alerts',
    active: false,
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

export default function Roadmap() {
  return (
    <section
      id="roadmap"
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
            What&apos;s Coming Next
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg max-w-xl mx-auto">
            A clear roadmap to becoming India&apos;s most comprehensive
            financial opportunity platform.
          </p>
        </motion.div>

        {/* Horizontal scrollable timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide"
        >
          <div className="flex gap-5 min-w-max md:min-w-0 md:grid md:grid-cols-5">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative min-w-[220px] md:min-w-0 rounded-2xl p-6 border transition-colors ${
                  phase.active
                    ? 'bg-accent/5 dark:bg-accent/10 border-accent/30'
                    : 'bg-white dark:bg-dark-card border-light-border dark:border-dark-border'
                }`}
              >
                {/* Phase node */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-4 ${
                    phase.active
                      ? 'bg-accent text-white'
                      : 'bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary border border-light-border dark:border-dark-border'
                  }`}
                >
                  {index + 1}
                </div>

                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    phase.active
                      ? 'text-accent'
                      : 'text-light-text-secondary dark:text-dark-text-secondary'
                  }`}
                >
                  {phase.label}
                </span>

                <h3 className="text-base font-semibold mt-2 mb-1 tracking-tight">
                  {phase.title}
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
