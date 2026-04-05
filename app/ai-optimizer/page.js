// app/ai-optimizer/page.js
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import AppShell from '../../components/ui/AppShell';
import InputField from '../../components/ui/InputField';
import SelectField from '../../components/ui/SelectField';
import ResultCard from '../../components/ui/ResultCard';
import Disclaimer from '../../components/ui/Disclaimer';
import {
  compareRegimes,
  generateRecommendations,
  formatINR,
} from '../../lib/taxEngine';
import { saveData, loadData } from '../../lib/storage';

const STEPS = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Income & Housing' },
  { id: 3, title: 'Investments' },
  { id: 4, title: 'Insurance & Loans' },
];

const defaultProfile = {
  incomeType: 'Salaried',
  grossIncome: '',
  age: 30,
  basicSalary: '',
  isMetro: true,
  rentPaid: '',
  hraReceived: '',
  deductions80C: '',
  deductions80CCD1B: '',
  deductions80D: '',
  deductions80DParents: '',
  deductions80E: '',
  deductions80G: '',
  deductions80TTA: '',
  homeLoanInterest: '',
  hraExemption: 0,
};

function num(v) {
  return typeof v === 'number' ? v : Number(v) || 0;
}

export default function AIOptimizerPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(() => loadData('profile', defaultProfile));
  const [results, setResults] = useState(null);

  const update = useCallback((key, val) => {
    setProfile((prev) => {
      const next = { ...prev, [key]: val };
      saveData('profile', next);
      return next;
    });
  }, []);

  const analyze = () => {
    const p = {
      grossIncome: num(profile.grossIncome),
      age: num(profile.age),
      basicSalary: num(profile.basicSalary),
      isMetro: profile.isMetro,
      rentPaid: num(profile.rentPaid),
      deductions80C: num(profile.deductions80C),
      deductions80CCD1B: num(profile.deductions80CCD1B),
      deductions80D: num(profile.deductions80D),
      deductions80DParents: num(profile.deductions80DParents),
      deductions80E: num(profile.deductions80E),
      deductions80G: num(profile.deductions80G),
      deductions80TTA: num(profile.deductions80TTA),
      homeLoanInterest: num(profile.homeLoanInterest),
      hraExemption: 0,
    };
    const regime = compareRegimes(p);
    const recs = generateRecommendations(p);
    setResults({ regime, recs });
    setStep(5);
  };

  const priorityColor = {
    high: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    medium: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
    low: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  };

  return (
    <AppShell
      title="AI Tax Optimizer"
      description="Answer a few questions about your finances and get personalized, AI-powered tax-saving recommendations."
    >
      <Disclaimer className="mb-6" />

      {/* Progress Steps */}
      {step <= 4 && (
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  step === s.id
                    ? 'bg-accent text-white'
                    : step > s.id
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'bg-light-surface dark:bg-dark-card text-light-text-secondary dark:text-dark-text-secondary'
                }`}
              >
                {step > s.id ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <span>{s.id}</span>
                )}
                {s.title}
              </button>
              {s.id < 4 && (
                <ChevronRight className="w-3.5 h-3.5 text-light-text-secondary dark:text-dark-text-secondary flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl space-y-5"
          >
            <h2 className="text-xl font-semibold tracking-tight">Tell us about yourself</h2>
            <SelectField
              label="Income Type"
              id="incomeType"
              value={profile.incomeType}
              onChange={(v) => update('incomeType', v)}
              options={[
                { value: 'Salaried', label: 'Salaried Employee' },
                { value: 'Self-Employed', label: 'Freelancer / Self-Employed' },
                { value: 'Business', label: 'Business Owner' },
                { value: 'Retired', label: 'Retired / Pensioner' },
              ]}
              required
            />
            <InputField
              label="Annual Gross Income"
              id="grossIncome"
              value={profile.grossIncome}
              onChange={(v) => update('grossIncome', v)}
              prefix="₹"
              placeholder="1200000"
              helpText="Your total income before any deductions"
              required
            />
            <InputField
              label="Age"
              id="age"
              value={profile.age}
              onChange={(v) => update('age', v)}
              min={18}
              max={100}
              helpText="Age affects tax slabs for senior citizens"
              required
            />
            <button
              onClick={() => setStep(2)}
              disabled={!profile.grossIncome}
              className="flex items-center gap-2 bg-accent hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl px-6 py-2.5 text-sm transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step 2: Income & Housing */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl space-y-5"
          >
            <h2 className="text-xl font-semibold tracking-tight">Income & Housing</h2>
            {profile.incomeType === 'Salaried' && (
              <InputField
                label="Basic Salary (Annual)"
                id="basicSalary"
                value={profile.basicSalary}
                onChange={(v) => update('basicSalary', v)}
                prefix="₹"
                placeholder="600000"
                helpText="Usually 40-50% of CTC"
              />
            )}
            <SelectField
              label="City Type"
              id="isMetro"
              value={profile.isMetro ? 'metro' : 'non-metro'}
              onChange={(v) => update('isMetro', v === 'metro')}
              options={[
                { value: 'metro', label: 'Metro (Delhi, Mumbai, Chennai, Kolkata)' },
                { value: 'non-metro', label: 'Non-Metro' },
              ]}
              helpText="Affects HRA calculation"
            />
            <InputField
              label="Monthly Rent Paid"
              id="rentPaid"
              value={profile.rentPaid}
              onChange={(v) => update('rentPaid', v)}
              prefix="₹"
              placeholder="15000"
              helpText="Leave blank if you own your home"
            />
            <InputField
              label="Home Loan Interest (Annual)"
              id="homeLoanInterest"
              value={profile.homeLoanInterest}
              onChange={(v) => update('homeLoanInterest', v)}
              prefix="₹"
              placeholder="200000"
              helpText="Interest component only (Section 24b, max ₹2L for self-occupied)"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary font-medium rounded-xl px-5 py-2.5 text-sm transition-colors hover:bg-light-surface dark:hover:bg-dark-card"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white font-medium rounded-xl px-6 py-2.5 text-sm transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Investments */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl space-y-5"
          >
            <h2 className="text-xl font-semibold tracking-tight">Investments & Savings</h2>
            <InputField
              label="Section 80C Investments"
              id="deductions80C"
              value={profile.deductions80C}
              onChange={(v) => update('deductions80C', v)}
              prefix="₹"
              placeholder="150000"
              helpText="PPF, ELSS, EPF, LIC, NSC, SCSS, FD, tuition fees, home loan principal (max ₹1.5L)"
            />
            <InputField
              label="NPS Additional (80CCD1B)"
              id="deductions80CCD1B"
              value={profile.deductions80CCD1B}
              onChange={(v) => update('deductions80CCD1B', v)}
              prefix="₹"
              placeholder="50000"
              helpText="Additional ₹50,000 NPS deduction over 80C"
            />
            <InputField
              label="Savings Account Interest (80TTA)"
              id="deductions80TTA"
              value={profile.deductions80TTA}
              onChange={(v) => update('deductions80TTA', v)}
              prefix="₹"
              placeholder="10000"
              helpText="Up to ₹10,000 (₹50,000 for senior citizens)"
            />
            <InputField
              label="Donations (80G)"
              id="deductions80G"
              value={profile.deductions80G}
              onChange={(v) => update('deductions80G', v)}
              prefix="₹"
              placeholder="0"
              helpText="Eligible charitable donations"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary font-medium rounded-xl px-5 py-2.5 text-sm transition-colors hover:bg-light-surface dark:hover:bg-dark-card"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white font-medium rounded-xl px-6 py-2.5 text-sm transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Insurance & Loans */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl space-y-5"
          >
            <h2 className="text-xl font-semibold tracking-tight">Insurance & Loans</h2>
            <InputField
              label="Health Insurance — Self & Family (80D)"
              id="deductions80D"
              value={profile.deductions80D}
              onChange={(v) => update('deductions80D', v)}
              prefix="₹"
              placeholder="25000"
              helpText="Premium paid for self, spouse, children (max ₹25K / ₹50K for senior)"
            />
            <InputField
              label="Health Insurance — Parents (80D)"
              id="deductions80DParents"
              value={profile.deductions80DParents}
              onChange={(v) => update('deductions80DParents', v)}
              prefix="₹"
              placeholder="25000"
              helpText="Premium for parents (max ₹25K / ₹50K if parent is senior)"
            />
            <InputField
              label="Education Loan Interest (80E)"
              id="deductions80E"
              value={profile.deductions80E}
              onChange={(v) => update('deductions80E', v)}
              prefix="₹"
              placeholder="0"
              helpText="Interest on education loan — no upper limit"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary font-medium rounded-xl px-5 py-2.5 text-sm transition-colors hover:bg-light-surface dark:hover:bg-dark-card"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={analyze}
                className="flex items-center gap-2 bg-accent hover:bg-blue-600 text-white font-medium rounded-xl px-6 py-2.5 text-sm transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Analyze My Taxes
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Results */}
        {step === 5 && results && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Regime Summary */}
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-4 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-accent" />
                Your Tax Analysis
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <ResultCard
                  label="Old Regime Tax"
                  value={formatINR(results.regime.oldRegime.totalTax)}
                  sublabel={`Effective rate: ${results.regime.oldRegime.effectiveRate}%`}
                />
                <ResultCard
                  label="New Regime Tax"
                  value={formatINR(results.regime.newRegime.totalTax)}
                  sublabel={`Effective rate: ${results.regime.newRegime.effectiveRate}%`}
                />
                <ResultCard
                  label="You Save"
                  value={formatINR(results.regime.savings)}
                  sublabel={results.regime.recommendedLabel}
                  highlight
                />
                <ResultCard
                  label="Recommended"
                  value={results.regime.recommended === 'new' ? 'New Regime' : results.regime.recommended === 'old' ? 'Old Regime' : 'Either'}
                  sublabel="Based on your profile"
                  accent
                />
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold tracking-tight">
                  Personalized Recommendations
                </h3>
                {results.recs.totalPotentialSaving > 0 && (
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Potential savings: {formatINR(results.recs.totalPotentialSaving)}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {results.recs.recommendations.map((rec) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="text-sm font-semibold">{rec.title}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${
                          priorityColor[rec.priority]
                        }`}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        <strong>Action:</strong> {rec.action}
                      </p>
                      {rec.potentialSaving > 0 && (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0 ml-4">
                          Save {formatINR(rec.potentialSaving)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Deduction Breakdown (Old Regime) */}
            <div>
              <h3 className="text-lg font-semibold tracking-tight mb-4">
                Old Regime Deduction Breakdown
              </h3>
              <div className="rounded-xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(results.regime.oldRegime.deductionBreakdown).map(
                      ([key, value]) => {
                        if (value <= 0) return null;
                        const labels = {
                          standardDeduction: 'Standard Deduction',
                          section80C: 'Section 80C',
                          section80D: 'Section 80D (Self)',
                          section80DParents: 'Section 80D (Parents)',
                          section80CCD1B: 'Section 80CCD(1B)',
                          section80E: 'Section 80E',
                          section80G: 'Section 80G',
                          section80TTA: 'Section 80TTA/TTB',
                          hraExemption: 'HRA Exemption',
                          homeLoanInterest: 'Home Loan Interest',
                          otherExemptions: 'Other Exemptions',
                        };
                        return (
                          <tr
                            key={key}
                            className="border-b border-light-border dark:border-dark-border last:border-0"
                          >
                            <td className="px-5 py-3 text-light-text-secondary dark:text-dark-text-secondary">
                              {labels[key] || key}
                            </td>
                            <td className="px-5 py-3 text-right font-medium tabular-nums">
                              {formatINR(value)}
                            </td>
                          </tr>
                        );
                      }
                    )}
                    <tr className="bg-light-surface dark:bg-dark-surface font-semibold">
                      <td className="px-5 py-3">Total Deductions</td>
                      <td className="px-5 py-3 text-right tabular-nums text-accent">
                        {formatINR(results.regime.oldRegime.totalDeductions)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Re-analyze */}
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary font-medium rounded-xl px-5 py-2.5 text-sm transition-colors hover:bg-light-surface dark:hover:bg-dark-card"
            >
              <ChevronLeft className="w-4 h-4" /> Modify & Re-analyze
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
