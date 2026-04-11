// app/regime-compare/page.js
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, Copy, Check, Save } from 'lucide-react';
import AppShell from '../../components/ui/AppShell';
import AuthGuard from '../../components/ui/AuthGuard';
import InputField from '../../components/ui/InputField';
import Disclaimer from '../../components/ui/Disclaimer';
import { calculateOldRegimeTax, calculateNewRegimeTax, formatINR, TAX_CONSTANTS } from '../../lib/taxEngine';
import { addHistory } from '../../lib/storage';
import { getSession } from '../../lib/auth';

export default function RegimeComparePage() {
  const [income, setIncome] = useState('');
  const [age, setAge] = useState(30);
  const [d80C, setD80C] = useState('');
  const [d80D, setD80D] = useState('');
  const [d80CCD1B, setD80CCD1B] = useState('');
  const [hra, setHra] = useState('');
  const [homeLoan, setHomeLoan] = useState('');
  const [d80E, setD80E] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const oldResult = calculateOldRegimeTax({
    grossIncome: income || 0,
    age,
    deductions80C: d80C || 0,
    deductions80D: d80D || 0,
    deductions80CCD1B: d80CCD1B || 0,
    hraExemption: hra || 0,
    homeLoanInterest: homeLoan || 0,
    deductions80E: d80E || 0,
  });

  const newResult = calculateNewRegimeTax({ grossIncome: income || 0 });
  const diff = oldResult.totalTax - newResult.totalTax;
  const recommended = diff > 0 ? 'new' : diff < 0 ? 'old' : 'either';

  const copyResults = () => {
    const text = `Tax Regime Comparison (Taxzify)\nIncome: ${formatINR(income)}\nOld Regime Tax: ${formatINR(oldResult.totalTax)} (${oldResult.effectiveRate}%)\nNew Regime Tax: ${formatINR(newResult.totalTax)} (${newResult.effectiveRate}%)\nSavings: ${formatINR(Math.abs(diff))} with ${recommended === 'new' ? 'New' : 'Old'} Regime`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const barMax = Math.max(oldResult.totalTax, newResult.totalTax, 1);

  const saveToHistory = () => {
    const session = getSession();
    addHistory({
      tool: 'Regime Comparison',
      user: session?.displayName || 'User',
      inputs: {
        'Gross Income': formatINR(income || 0),
        'Age': age,
        '80C': formatINR(d80C || 0),
        '80D': formatINR(d80D || 0),
        'NPS': formatINR(d80CCD1B || 0),
        'HRA': formatINR(hra || 0),
        'Home Loan': formatINR(homeLoan || 0),
      },
      outputs: {
        'Old Regime Tax': formatINR(oldResult.totalTax),
        'New Regime Tax': formatINR(newResult.totalTax),
        'Savings': formatINR(Math.abs(diff)),
        'Recommended': recommended === 'new' ? 'New Regime' : recommended === 'old' ? 'Old Regime' : 'Either',
      },
    });
    setSaved(true);
  };

  return (
    <AuthGuard>
    <AppShell title="Regime Comparison" description="Enter your details to see an instant comparison between Old and New tax regimes.">
      <Disclaimer className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Your Details</h3>
          <InputField label="Gross Income" id="ri-income" value={income} onChange={setIncome} prefix="₹" />
          <InputField label="Age" id="ri-age" type="number" value={age} onChange={setAge} min={18} max={100} />
          <InputField label="80C Investments" id="ri-80c" value={d80C} onChange={setD80C} prefix="₹" helpText="Max ₹1,50,000" />
          <InputField label="80D Health Insurance" id="ri-80d" value={d80D} onChange={setD80D} prefix="₹" helpText="Self + Family" />
          <InputField label="NPS 80CCD(1B)" id="ri-nps" value={d80CCD1B} onChange={setD80CCD1B} prefix="₹" helpText="Max ₹50,000" />
          <InputField label="HRA Exemption" id="ri-hra" value={hra} onChange={setHra} prefix="₹" />
          <InputField label="Home Loan Interest" id="ri-hl" value={homeLoan} onChange={setHomeLoan} prefix="₹" helpText="Section 24b" />
          <InputField label="Education Loan Interest (80E)" id="ri-80e" value={d80E} onChange={setD80E} prefix="₹" />
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          {/* Summary */}
          <motion.div
            key={diff}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-2xl border text-center ${
              recommended === 'new'
                ? 'bg-accent/5 dark:bg-accent/10 border-accent/30'
                : recommended === 'old'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'
                : 'bg-light-surface dark:bg-dark-card border-light-border dark:border-dark-border'
            }`}
          >
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
              {recommended === 'either' ? 'Both regimes result in same tax' : `${recommended === 'new' ? 'New' : 'Old'} Regime saves you`}
            </p>
            <p className="text-4xl font-bold tabular-nums text-accent">{formatINR(Math.abs(diff))}</p>
            <div className="flex justify-center mt-3">
              <button
                onClick={copyResults}
                className="flex items-center gap-1.5 text-xs text-light-text-secondary dark:text-dark-text-secondary hover:text-accent transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy results'}
              </button>
            </div>
          </motion.div>

          {/* Visual Bar Comparison */}
          <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border space-y-4">
            <h4 className="text-sm font-semibold">Tax Comparison</h4>
            {/* Old Regime Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-amber-600 dark:text-amber-400 font-medium">Old Regime</span>
                <span className="font-semibold tabular-nums">{formatINR(oldResult.totalTax)}</span>
              </div>
              <div className="h-8 rounded-lg bg-light-surface dark:bg-dark-surface overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(oldResult.totalTax / barMax) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="h-full rounded-lg bg-amber-500/70 dark:bg-amber-500/50"
                />
              </div>
            </div>
            {/* New Regime Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-accent font-medium">New Regime</span>
                <span className="font-semibold tabular-nums">{formatINR(newResult.totalTax)}</span>
              </div>
              <div className="h-8 rounded-lg bg-light-surface dark:bg-dark-surface overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(newResult.totalTax / barMax) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
                  className="h-full rounded-lg bg-accent/70 dark:bg-accent/50"
                />
              </div>
            </div>
          </div>

          {/* Detailed Side-by-Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Old Regime Detail */}
            <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border border-t-4 border-t-amber-500">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-4">Old Regime</p>
              <div className="space-y-2.5 text-sm">
                <Row label="Gross Income" value={formatINR(income)} />
                <Row label="Standard Deduction" value={`-${formatINR(TAX_CONSTANTS.STANDARD_DEDUCTION_OLD)}`} />
                <Row label="Total Deductions" value={`-${formatINR(oldResult.totalDeductions)}`} />
                <div className="border-t border-light-border dark:border-dark-border pt-2.5">
                  <Row label="Taxable Income" value={formatINR(oldResult.taxableIncome)} bold />
                </div>
                <Row label="Base Tax" value={formatINR(oldResult.baseTax)} />
                <Row label="Surcharge" value={formatINR(oldResult.surcharge)} />
                <Row label="Cess (4%)" value={formatINR(oldResult.cess)} />
                <div className="border-t border-light-border dark:border-dark-border pt-2.5">
                  <Row label="Total Tax" value={formatINR(oldResult.totalTax)} bold accent="amber" />
                </div>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  Effective Rate: {oldResult.effectiveRate}%
                </p>
              </div>
            </div>

            {/* New Regime Detail */}
            <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border border-t-4 border-t-accent relative">
              {recommended === 'new' && (
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                  Recommended
                </span>
              )}
              <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-4">New Regime</p>
              <div className="space-y-2.5 text-sm">
                <Row label="Gross Income" value={formatINR(income)} />
                <Row label="Standard Deduction" value={`-${formatINR(TAX_CONSTANTS.STANDARD_DEDUCTION_NEW)}`} />
                <Row label="Other Deductions" value="Not allowed" muted />
                <div className="border-t border-light-border dark:border-dark-border pt-2.5">
                  <Row label="Taxable Income" value={formatINR(newResult.taxableIncome)} bold />
                </div>
                <Row label="Base Tax" value={formatINR(newResult.baseTax)} />
                <Row label="Surcharge" value={formatINR(newResult.surcharge)} />
                <Row label="Cess (4%)" value={formatINR(newResult.cess)} />
                <div className="border-t border-light-border dark:border-dark-border pt-2.5">
                  <Row label="Total Tax" value={formatINR(newResult.totalTax)} bold accent="blue" />
                </div>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                  Effective Rate: {newResult.effectiveRate}%
                </p>
              </div>
            </div>
          </div>
          {/* Save to History */}
          <div className="flex justify-end">
            <button
              onClick={saveToHistory}
              disabled={saved || !income}
              className={`flex items-center gap-2 font-medium rounded-xl px-5 py-2.5 text-sm transition-colors ${saved ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-default' : 'bg-accent hover:bg-blue-600 text-white disabled:opacity-40'}`}
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved to History ✓' : 'Save to History'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
    </AuthGuard>
  );
}

function Row({ label, value, bold = false, accent = '', muted = false }) {
  return (
    <div className="flex justify-between items-center">
      <span className={`${muted ? 'text-light-text-secondary/50 dark:text-dark-text-secondary/50 italic' : 'text-light-text-secondary dark:text-dark-text-secondary'}`}>
        {label}
      </span>
      <span
        className={`tabular-nums ${bold ? 'font-semibold' : 'font-medium'} ${
          accent === 'amber'
            ? 'text-amber-600 dark:text-amber-400'
            : accent === 'blue'
            ? 'text-accent'
            : ''
        } ${muted ? 'text-light-text-secondary/50 dark:text-dark-text-secondary/50 italic' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}
