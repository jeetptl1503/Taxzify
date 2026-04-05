// components/ThemeToggle.jsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-light-surface dark:bg-dark-surface" />
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9, rotate: 15 }}
      transition={{ duration: 0.2 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-9 h-9 flex items-center justify-center rounded-full bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border hover:bg-light-border dark:hover:bg-dark-card transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-light-text-secondary" />
      )}
    </motion.button>
  );
}
