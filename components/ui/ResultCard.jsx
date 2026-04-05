// components/ui/ResultCard.jsx
'use client';

import { motion } from 'framer-motion';

export default function ResultCard({
  label,
  value,
  sublabel = '',
  accent = false,
  highlight = false,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`rounded-xl p-5 border ${
        highlight
          ? 'bg-accent/5 dark:bg-accent/10 border-accent/30'
          : 'bg-white dark:bg-dark-card border-light-border dark:border-dark-border'
      } ${className}`}
    >
      <p className="text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-bold tabular-nums tracking-tight ${
          accent
            ? 'text-accent'
            : highlight
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-light-text-primary dark:text-dark-text-primary'
        }`}
      >
        {value}
      </p>
      {sublabel && (
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
          {sublabel}
        </p>
      )}
    </motion.div>
  );
}
