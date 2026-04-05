// components/ui/AppShell.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BrainCircuit,
  TrendingUp,
  Building2,
  GitCompare,
  Search,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  Shield,
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ai-optimizer', label: 'AI Optimizer', icon: BrainCircuit },
  { href: '/regime-compare', label: 'Regime Compare', icon: GitCompare },
  { href: '/investments', label: 'Investments', icon: TrendingUp },
  { href: '/business', label: 'Business Suite', icon: Building2 },
  { href: '/deductions', label: 'Deductions', icon: Search },
];

export default function AppShell({ children, title, description }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-light-surface dark:bg-black flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-dark-surface border-r border-light-border dark:border-dark-border fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="h-16 px-6 flex items-center border-b border-light-border dark:border-dark-border">
          <Link href="/" className="flex items-center gap-1.5 font-semibold text-lg">
            <Sparkles className="w-5 h-5 text-accent" />
            <span>Taxzify</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent/10 text-accent'
                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-surface dark:hover:bg-dark-card hover:text-light-text-primary dark:hover:text-dark-text-primary'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-light-border dark:border-dark-border">
          <div className="flex items-center gap-2 text-xs text-light-text-secondary dark:text-dark-text-secondary">
            <Shield className="w-3.5 h-3.5" />
            <span>Data stays on your device</span>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-dark-surface border-r border-light-border dark:border-dark-border z-50 lg:hidden flex flex-col"
            >
              <div className="h-16 px-6 flex items-center justify-between border-b border-light-border dark:border-dark-border">
                <Link href="/" className="flex items-center gap-1.5 font-semibold text-lg">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span>Taxzify</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-light-text-secondary" />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'bg-accent/10 text-accent'
                          : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-surface dark:hover:bg-dark-card'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl border-b border-light-border dark:border-dark-border flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-light-surface dark:hover:bg-dark-card"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-1 text-xs text-light-text-secondary dark:text-dark-text-secondary hover:text-accent transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <div className="hidden sm:block w-px h-5 bg-light-border dark:bg-dark-border" />
            <h1 className="text-base font-semibold tracking-tight truncate">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs text-light-text-secondary dark:text-dark-text-secondary hover:text-accent transition-colors"
            >
              Home
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 max-w-6xl mx-auto">
          {description && (
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-6 max-w-2xl">
              {description}
            </p>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
