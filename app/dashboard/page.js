// app/dashboard/page.js
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  TrendingUp,
  Building2,
  GitCompare,
  Search,
  MapPin,
  Shield,
  ArrowRight,
} from 'lucide-react';
import AppShell from '../../components/ui/AppShell';
import AuthGuard from '../../components/ui/AuthGuard';

const modules = [
  {
    href: '/ai-optimizer',
    icon: BrainCircuit,
    title: 'AI Tax Optimizer',
    description: 'Get personalized, AI-powered recommendations to maximize your tax savings based on your exact financial profile.',
    tag: 'Most Popular',
    tagColor: 'bg-accent/10 text-accent',
  },
  {
    href: '/regime-compare',
    icon: GitCompare,
    title: 'Regime Comparison',
    description: 'Interactive Old vs New regime calculator with real-time results. Know exactly which regime saves you more.',
    tag: 'Quick Tool',
    tagColor: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  },
  {
    href: '/investments',
    icon: TrendingUp,
    title: 'Investment Planner',
    description: 'SIP calculator, NPS planner, 80C gap analyzer, and side-by-side investment comparison for tax-saving instruments.',
    tag: 'New',
    tagColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  },
  {
    href: '/business',
    icon: Building2,
    title: 'Business Suite',
    description: 'GST calculator, compliance tracker, MSME benefit checker, and expense categorizer for businesses.',
    tag: 'For Business',
    tagColor: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  },
  {
    href: '/deductions',
    icon: Search,
    title: 'Deduction Discovery',
    description: 'Explore 20+ deduction sections with eligibility, limits, and claiming instructions filtered to your profile.',
    tag: null,
  },
  {
    href: '/#waitlist',
    icon: MapPin,
    title: 'Subsidy Finder',
    description: 'Find government schemes, subsidies, and benefits you qualify for across central and state programs.',
    tag: 'Coming Soon',
    tagColor: 'bg-light-surface dark:bg-dark-card text-light-text-secondary dark:text-dark-text-secondary',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.05, staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function DashboardPage() {
  return (
    <AuthGuard>
    <AppShell title="Dashboard" description="Welcome to Taxzify. Choose a module to get started.">
      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 p-3 rounded-xl bg-accent/5 dark:bg-accent/10 border border-accent/20 text-sm text-accent mb-8"
      >
        <Shield className="w-4 h-4 flex-shrink-0" />
        <p>Your data stays on this device. Nothing is sent to any server. 100% private.</p>
      </motion.div>

      {/* Module Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <motion.div key={mod.href} variants={itemVariants}>
              <Link
                href={mod.href}
                className="group block h-full p-6 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-accent/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  {mod.tag && (
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${mod.tagColor}`}>
                      {mod.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-1.5 group-hover:text-accent transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed mb-4">
                  {mod.description}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </AppShell>
    </AuthGuard>
  );
}
