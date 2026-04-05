// components/Hero.jsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

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

const benefitCards = [
  {
    text: '₹1,50,000 — 80C Deduction Available ✓',
    color: 'border-l-emerald-500',
    rotate: '-rotate-2',
    delay: 0.6,
  },
  {
    text: 'New Regime saves ₹18,400 more for you',
    color: 'border-l-accent',
    rotate: 'rotate-0',
    delay: 0.8,
  },
  {
    text: "PM Awas Yojana Subsidy — You're Eligible",
    color: 'border-l-amber-500',
    rotate: 'rotate-2',
    delay: 1.0,
  },
];

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
      {/* Subtle gradient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-blue-400/5 dark:bg-blue-400/10 blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-4xl mx-auto text-center"
      >
        {/* Badge Pill */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary">
            🇮🇳 Built for India&apos;s 80M+ Taxpayers
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
        >
          Stop Leaving Tax Benefits
          <br />
          <span className="text-accent">on the Table.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Taxzify maps every deduction, rebate, and government subsidy you
          qualify for — personalized, simplified, and always up to date.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/dashboard"
            className="bg-accent hover:bg-blue-600 text-white font-medium rounded-full px-7 py-3 text-base transition-colors flex items-center gap-2"
          >
            Explore Your Benefits
            <span aria-hidden="true">→</span>
          </Link>
          <a
            href="#how-it-works"
            className="border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary hover:bg-light-surface dark:hover:bg-dark-surface font-medium rounded-full px-7 py-3 text-base transition-colors"
          >
            See How It Works
          </a>
        </motion.div>

        {/* Floating Dashboard Mockup */}
        <motion.div
          variants={itemVariants}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {benefitCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: card.delay,
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ scale: 1.015 }}
                className={`glass-card border-l-4 ${card.color} ${card.rotate} px-5 py-4 w-full sm:w-auto sm:min-w-[220px] text-left`}
              >
                <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary leading-snug">
                  {card.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
