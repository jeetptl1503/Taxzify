// app/investments/page.js
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PiggyBank, Landmark, BarChart3 } from 'lucide-react';
import AppShell from '../../components/ui/AppShell';
import InputField from '../../components/ui/InputField';
import ResultCard from '../../components/ui/ResultCard';
import Disclaimer from '../../components/ui/Disclaimer';
import {
  INSTRUMENTS,
  calculateSIPFutureValue,
  calculateNPSCorpus,
  analyze80CGap,
} from '../../lib/investmentEngine';
import { formatINR } from '../../lib/taxEngine';

const TABS = [
  { id: 'sip', label: 'SIP Calculator', icon: TrendingUp },
  { id: 'nps', label: 'NPS Planner', icon: Landmark },
  { id: '80c', label: '80C Analyzer', icon: PiggyBank },
  { id: 'compare', label: 'Compare', icon: BarChart3 },
];

export default function InvestmentsPage() {
  const [tab, setTab] = useState('sip');

  // SIP state
  const [sipAmount, setSipAmount] = useState(10000);
  const [sipReturn, setSipReturn] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // NPS state
  const [npsAge, setNpsAge] = useState(30);
  const [npsMonthly, setNpsMonthly] = useState(5000);
  const [npsReturn, setNpsReturn] = useState(10);

  // 80C state
  const [epf, setEpf] = useState(0);
  const [ppf, setPpf] = useState(0);
  const [elss, setElss] = useState(0);
  const [lic, setLic] = useState(0);
  const [hlPrincipal, setHlPrincipal] = useState(0);
  const [tuition, setTuition] = useState(0);

  const sipResult = calculateSIPFutureValue({
    monthlyAmount: sipAmount || 0,
    expectedReturnPercent: sipReturn || 0,
    durationYears: sipYears || 0,
  });

  const npsResult = calculateNPSCorpus({
    currentAge: npsAge || 30,
    monthlyContribution: npsMonthly || 0,
    expectedReturnPercent: npsReturn || 10,
  });

  const gap80C = analyze80CGap({
    epfContribution: epf || 0,
    ppfContribution: ppf || 0,
    elssInvestment: elss || 0,
    lifeInsurancePremium: lic || 0,
    homeLoanPrincipal: hlPrincipal || 0,
    tuitionFees: tuition || 0,
  });

  return (
    <AppShell title="Investment Planner" description="Plan your tax-saving investments with calculators and comparisons.">
      <Disclaimer className="mb-6" />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.id
                  ? 'bg-accent text-white'
                  : 'bg-white dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* SIP Calculator */}
      {tab === 'sip' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">SIP Inputs</h3>
            <InputField label="Monthly SIP Amount" id="sip-amount" value={sipAmount} onChange={setSipAmount} prefix="₹" />
            <InputField label="Expected Annual Return (%)" id="sip-return" value={sipReturn} onChange={setSipReturn} suffix="%" min={1} max={30} />
            <InputField label="Investment Duration (Years)" id="sip-years" value={sipYears} onChange={setSipYears} suffix="yrs" min={1} max={40} />
          </div>
          <div className="space-y-3">
            <ResultCard label="Total Invested" value={formatINR(sipResult.totalInvested)} />
            <ResultCard label="Future Value" value={formatINR(sipResult.futureValue)} accent />
            <ResultCard label="Wealth Gained" value={formatINR(sipResult.wealthGained)} highlight />
            <div className="p-4 rounded-xl bg-light-surface dark:bg-dark-surface">
              {/* Progress bar */}
              <div className="flex justify-between text-xs text-light-text-secondary dark:text-dark-text-secondary mb-2">
                <span>Invested</span>
                <span>Returns</span>
              </div>
              <div className="h-4 rounded-full bg-accent/20 overflow-hidden flex">
                <div
                  className="h-full bg-accent/60"
                  style={{ width: `${sipResult.futureValue > 0 ? (sipResult.totalInvested / sipResult.futureValue) * 100 : 50}%` }}
                />
                <div className="h-full bg-emerald-500/60 flex-1" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* NPS Planner */}
      {tab === 'nps' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">NPS Inputs</h3>
            <InputField label="Current Age" id="nps-age" value={npsAge} onChange={setNpsAge} min={18} max={59} />
            <InputField label="Monthly Contribution" id="nps-monthly" value={npsMonthly} onChange={setNpsMonthly} prefix="₹" />
            <InputField label="Expected Return (%)" id="nps-return" value={npsReturn} onChange={setNpsReturn} suffix="%" min={5} max={15} />
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">Retirement age: 60</p>
          </div>
          {npsResult && (
            <div className="space-y-3">
              <ResultCard label="Years to Retirement" value={`${npsResult.yearsToRetirement} years`} />
              <ResultCard label="Total Invested" value={formatINR(npsResult.totalInvested)} />
              <ResultCard label="Projected Corpus" value={formatINR(npsResult.futureValue)} accent />
              <ResultCard label="Tax-Free Withdrawal (60%)" value={formatINR(npsResult.taxFreeWithdrawal)} highlight />
              <ResultCard label="Est. Monthly Pension" value={formatINR(npsResult.estimatedMonthlyPension)} sublabel="Based on 6% annuity rate" />
              <ResultCard label="Yearly Tax Benefit (80CCD1B)" value={formatINR(npsResult.yearlyTaxBenefit)} sublabel={`Total tax saved: ${formatINR(npsResult.totalTaxSaved)}`} />
            </div>
          )}
        </motion.div>
      )}

      {/* 80C Gap Analyzer */}
      {tab === '80c' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Your 80C Investments</h3>
            <InputField label="EPF Contribution" id="80c-epf" value={epf} onChange={setEpf} prefix="₹" />
            <InputField label="PPF Contribution" id="80c-ppf" value={ppf} onChange={setPpf} prefix="₹" />
            <InputField label="ELSS Investment" id="80c-elss" value={elss} onChange={setElss} prefix="₹" />
            <InputField label="Life Insurance Premium" id="80c-lic" value={lic} onChange={setLic} prefix="₹" />
            <InputField label="Home Loan Principal" id="80c-hl" value={hlPrincipal} onChange={setHlPrincipal} prefix="₹" />
            <InputField label="Tuition Fees" id="80c-tuition" value={tuition} onChange={setTuition} prefix="₹" />
          </div>
          <div className="space-y-4">
            {/* Utilization Gauge */}
            <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">80C Utilization</p>
                  <p className="text-3xl font-bold tabular-nums text-accent">{gap80C.utilizationPercent}%</p>
                </div>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary tabular-nums">
                  {formatINR(gap80C.utilized)} / {formatINR(gap80C.limit)}
                </p>
              </div>
              <div className="h-3 rounded-full bg-light-surface dark:bg-dark-surface overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(gap80C.utilizationPercent, 100)}%` }}
                  transition={{ duration: 0.6 }}
                  className={`h-full rounded-full ${gap80C.utilizationPercent >= 100 ? 'bg-emerald-500' : 'bg-accent'}`}
                />
              </div>
            </div>
            {gap80C.gap > 0 ? (
              <ResultCard label="Gap Remaining" value={formatINR(gap80C.gap)} sublabel="Invest this to max out 80C tax benefit" accent />
            ) : (
              <ResultCard label="Status" value="Fully Utilized ✓" sublabel="Your 80C limit is maxed out" highlight />
            )}
            {gap80C.overLimit > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-sm text-amber-700 dark:text-amber-400">
                ₹{gap80C.overLimit.toLocaleString('en-IN')} exceeds the ₹1.5L limit and won&apos;t get tax benefit.
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Investment Comparison */}
      {tab === 'compare' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-light-border dark:border-dark-border">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Instrument</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Lock-in</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Expected Return</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Tax on Gains</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Risk</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">80C</th>
                </tr>
              </thead>
              <tbody>
                {INSTRUMENTS.map((inst) => (
                  <tr key={inst.id} className="border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-surface dark:hover:bg-dark-surface transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{inst.name}</p>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{inst.fullName}</p>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums">{inst.lockIn}</td>
                    <td className="px-5 py-3.5 tabular-nums text-accent font-medium">{inst.expectedReturn.min}–{inst.expectedReturn.max}%</td>
                    <td className="px-5 py-3.5 text-xs">{inst.taxOnGains}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        inst.riskLevel === 'Zero' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                        inst.riskLevel === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {inst.riskLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">{inst.section80C ? '✅' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </AppShell>
  );
}
