// app/deductions/page.js
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Info } from 'lucide-react';
import AppShell from '../../components/ui/AppShell';
import Disclaimer from '../../components/ui/Disclaimer';
import { DEDUCTION_SECTIONS, formatINR } from '../../lib/taxEngine';

const CATEGORIES = ['All', 'Investment', 'Insurance', 'Loans', 'Income', 'Special', 'Donations'];
const INCOME_TYPES = ['All', 'Salaried', 'Self-Employed', 'Business'];

export default function DeductionsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [incomeType, setIncomeType] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    return DEDUCTION_SECTIONS.filter((d) => {
      const matchSearch =
        !search ||
        d.section.toLowerCase().includes(search.toLowerCase()) ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === 'All' || d.category === category;
      const matchType = incomeType === 'All' || d.eligibleFor.includes(incomeType);
      return matchSearch && matchCategory && matchType;
    });
  }, [search, category, incomeType]);

  return (
    <AppShell
      title="Deduction Discovery"
      description="Explore every deduction section available under Indian tax law. Filter by your profile to find what you qualify for."
    >
      <Disclaimer className="mb-6" />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sections (e.g. 80C, HRA, home loan...)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary/50 dark:placeholder:text-dark-text-secondary/50"
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-light-text-secondary dark:text-dark-text-secondary" />
          <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Category:</span>
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  category === c
                    ? 'bg-accent text-white'
                    : 'bg-light-surface dark:bg-dark-card text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Income:</span>
          <div className="flex gap-1.5 flex-wrap">
            {INCOME_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setIncomeType(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  incomeType === t
                    ? 'bg-accent text-white'
                    : 'bg-light-surface dark:bg-dark-card text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-4">
        Showing {filtered.length} of {DEDUCTION_SECTIONS.length} sections
      </p>

      {/* Deduction Cards */}
      <div className="space-y-3">
        {filtered.map((d) => (
          <motion.div
            key={d.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === d.id ? null : d.id)}
              className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-light-surface/50 dark:hover:bg-dark-surface/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold text-accent">{d.section}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary">
                    {d.category}
                  </span>
                  {d.regime === 'both' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                      Both Regimes
                    </span>
                  )}
                  {d.regime === 'old' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                      Old Regime Only
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold">{d.title}</h3>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {d.maxLimit && (
                  <span className="text-sm font-semibold tabular-nums text-accent">
                    {formatINR(d.maxLimit)}
                  </span>
                )}
                {!d.maxLimit && d.section !== 'HRA Exemption' && d.section !== 'LTA Exemption' && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    No limit
                  </span>
                )}
                <motion.div
                  animate={{ rotate: expanded === d.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Info className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                </motion.div>
              </div>
            </button>

            {expanded === d.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-5 pb-5 border-t border-light-border dark:border-dark-border pt-4"
              >
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed mb-3">
                  {d.description}
                </p>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div>
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">Max Limit: </span>
                    <span className="font-medium">
                      {d.maxLimit ? formatINR(d.maxLimit) : 'No upper limit'}
                    </span>
                  </div>
                  <div>
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">Eligible for: </span>
                    <span className="font-medium">{d.eligibleFor.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">Regime: </span>
                    <span className="font-medium">
                      {d.regime === 'both' ? 'Old & New' : d.regime === 'old' ? 'Old Only' : 'New Only'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            No deduction sections match your filters. Try adjusting your search.
          </div>
        )}
      </div>
    </AppShell>
  );
}
