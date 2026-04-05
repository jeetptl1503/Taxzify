// components/FeaturesGrid.jsx
'use client';

import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  GitCompare,
  Search,
  MapPin,
  BookOpen,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: LayoutDashboard,
    title: 'Smart Financial Opportunity Dashboard',
    description:
      'Real-time benefit tracking, deduction visibility, and personalized opportunity alerts — all in one place.',
  },
  {
    icon: GitCompare,
    title: 'Tax Regime Comparison Engine',
    description:
      'Data-backed Old vs New Regime analysis. Know exactly which structure saves you more before you commit.',
  },
  {
    icon: Search,
    title: 'Deduction & Exemption Discovery',
    description:
      'Section 80C, 80D, HRA, LTA and 40+ more — automatically mapped to your profile so you miss nothing.',
  },
  {
    icon: MapPin,
    title: 'Subsidy Identification Module',
    description:
      'Central and State government schemes, sector incentives, and benefit windows tracked and matched to you.',
  },
  {
    icon: BookOpen,
    title: 'Financial Awareness Engine',
    description:
      'Complex policy language translated into clear, actionable insights with personalized alerts.',
  },
  {
    icon: Shield,
    title: 'Secure Data Architecture',
    description:
      'Encrypted storage, privacy-first design, and role-based access — your financial data protected at every layer.',
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

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-semibold tracking-tight mb-4">
            Everything You Need to Optimize
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg max-w-xl mx-auto">
            Six powerful modules working together to find every financial
            opportunity you qualify for.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.2 }}
                className="glass-card p-7 group"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
