// components/SecuritySection.jsx
'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Users, CheckCircle } from 'lucide-react';

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Encrypted Storage',
    description: 'AES-256 encryption at rest and in transit',
  },
  {
    icon: Lock,
    title: 'Privacy-First Design',
    description: 'We never sell or share your financial data',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Granular permissions for every user level',
  },
  {
    icon: CheckCircle,
    title: 'Compliance Ready',
    description: 'Built on RBI-grade security standards',
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

export default function SecuritySection() {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-semibold tracking-tight mb-4">
            Your Financial Data, Fully Protected
          </h2>
          <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg max-w-xl mx-auto">
            Enterprise-grade security from day one — because trust is non-negotiable.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-base font-semibold mb-2 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
