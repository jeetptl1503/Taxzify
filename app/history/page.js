// app/history/page.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Download, Trash2, ChevronDown, AlertTriangle } from 'lucide-react';
import AppShell from '../../components/ui/AppShell';
import AuthGuard from '../../components/ui/AuthGuard';
import { getHistory, deleteHistoryEntry, clearHistory, downloadHistoryPDF } from '../../lib/storage';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id) => {
    deleteHistoryEntry(id);
    setHistory(getHistory());
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    setShowClearConfirm(false);
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const toolColors = {
    'AI Tax Optimizer': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    'Regime Comparison': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    'SIP Calculator': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    'NPS Planner': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    '80C Analyzer': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
    'GST Calculator': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
  };

  return (
    <AuthGuard>
      <AppShell title="History" description="View your past calculations. Download any entry as a PDF report.">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
            {history.length} {history.length === 1 ? 'entry' : 'entries'}
          </p>
          {history.length > 0 && (
            <div className="relative">
              {showClearConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600 dark:text-red-400">Delete all?</span>
                  <button
                    onClick={handleClearAll}
                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
                  >
                    Yes, clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="text-xs text-light-text-secondary dark:text-dark-text-secondary hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {/* Empty State */}
        {history.length === 0 && (
          <div className="text-center py-20">
            <Clock className="w-10 h-10 mx-auto text-light-text-secondary/30 dark:text-dark-text-secondary/30 mb-4" />
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              No calculations saved yet.
            </p>
            <p className="text-xs text-light-text-secondary/60 dark:text-dark-text-secondary/60 mt-1">
              Use any tool and click &quot;Save to History&quot; to store your results here.
            </p>
          </div>
        )}

        {/* History List */}
        <div className="space-y-3">
          <AnimatePresence>
            {history.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border overflow-hidden"
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-light-surface/50 dark:hover:bg-dark-surface/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0 ${
                        toolColors[entry.tool] || 'bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary'
                      }`}
                    >
                      {entry.tool}
                    </span>
                    <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary truncate">
                      {formatDate(entry.timestamp)}
                    </span>
                    {entry.user && (
                      <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        by {entry.user}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadHistoryPDF(entry);
                      }}
                      className="p-1.5 rounded-lg hover:bg-accent/10 text-accent transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(entry.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-light-text-secondary dark:text-dark-text-secondary hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <motion.div
                      animate={{ rotate: expanded === entry.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                    </motion.div>
                  </div>
                </button>

                {/* Expanded detail */}
                {expanded === entry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-light-border dark:border-dark-border"
                  >
                    <div className="p-5 space-y-4">
                      {/* Inputs */}
                      {entry.inputs && Object.keys(entry.inputs).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-2">
                            Inputs
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                            {Object.entries(entry.inputs).map(([k, v]) => (
                              <div key={k} className="flex justify-between text-sm py-1 border-b border-light-border/50 dark:border-dark-border/50">
                                <span className="text-light-text-secondary dark:text-dark-text-secondary">{k}</span>
                                <span className="font-medium tabular-nums">{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Outputs */}
                      {entry.outputs && Object.keys(entry.outputs).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-2">
                            Results
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                            {Object.entries(entry.outputs).map(([k, v]) => (
                              <div key={k} className="flex justify-between text-sm py-1 border-b border-light-border/50 dark:border-dark-border/50">
                                <span className="text-light-text-secondary dark:text-dark-text-secondary">{k}</span>
                                <span className="font-semibold text-accent tabular-nums">{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      {entry.summary && (
                        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary leading-relaxed bg-light-surface dark:bg-dark-surface p-3 rounded-xl">
                          {entry.summary}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
