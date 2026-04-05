// app/business/page.js
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ClipboardCheck, Building2, ExternalLink } from 'lucide-react';
import AppShell from '../../components/ui/AppShell';
import InputField from '../../components/ui/InputField';
import SelectField from '../../components/ui/SelectField';
import ResultCard from '../../components/ui/ResultCard';
import Disclaimer from '../../components/ui/Disclaimer';
import {
  GST_RATES,
  calculateGST,
  reverseCalculateGST,
  HSN_CODES,
  COMPLIANCE_DEADLINES,
  classifyMSME,
} from '../../lib/gstEngine';
import { GOVERNMENT_SCHEMES, findEligibleSchemes } from '../../lib/subsidyData';
import { formatINR } from '../../lib/taxEngine';

const TABS = [
  { id: 'gst', label: 'GST Calculator', icon: Calculator },
  { id: 'compliance', label: 'Compliance Tracker', icon: ClipboardCheck },
  { id: 'msme', label: 'MSME Benefits', icon: Building2 },
];

export default function BusinessPage() {
  const [tab, setTab] = useState('gst');

  // GST
  const [gstMode, setGstMode] = useState('forward');
  const [gstAmount, setGstAmount] = useState(100000);
  const [gstRate, setGstRate] = useState(18);
  const [isInterState, setIsInterState] = useState(false);
  const [hsnSearch, setHsnSearch] = useState('');

  // Compliance
  const [completedItems, setCompletedItems] = useState({});

  // MSME
  const [investment, setInvestment] = useState('');
  const [turnover, setTurnover] = useState('');

  const gstResult =
    gstMode === 'forward'
      ? calculateGST({ amount: gstAmount || 0, rate: gstRate, isInterState })
      : reverseCalculateGST({ totalAmount: gstAmount || 0, rate: gstRate, isInterState });

  const filteredHSN = hsnSearch
    ? HSN_CODES.filter(
        (h) =>
          h.hsn.includes(hsnSearch) ||
          h.description.toLowerCase().includes(hsnSearch.toLowerCase())
      )
    : HSN_CODES.slice(0, 10);

  const msmeResult =
    investment && turnover
      ? classifyMSME({
          investmentInPlant: Number(investment),
          annualTurnover: Number(turnover),
        })
      : null;

  const eligibleSchemes = findEligibleSchemes('Business');

  const toggleCompleted = (id) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const groupedDeadlines = COMPLIANCE_DEADLINES.reduce((acc, d) => {
    if (!acc[d.category]) acc[d.category] = [];
    acc[d.category].push(d);
    return acc;
  }, {});

  return (
    <AppShell title="Business Suite" description="GST tools, compliance tracking, and MSME benefit discovery for businesses.">
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

      {/* GST Calculator */}
      {tab === 'gst' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Calculate GST</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setGstMode('forward')}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${gstMode === 'forward' ? 'bg-accent text-white' : 'bg-light-surface dark:bg-dark-surface text-light-text-secondary'}`}
                >
                  Add GST
                </button>
                <button
                  onClick={() => setGstMode('reverse')}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${gstMode === 'reverse' ? 'bg-accent text-white' : 'bg-light-surface dark:bg-dark-surface text-light-text-secondary'}`}
                >
                  Extract GST
                </button>
              </div>
              <InputField
                label={gstMode === 'forward' ? 'Base Amount (excl. GST)' : 'Total Amount (incl. GST)'}
                id="gst-amount"
                value={gstAmount}
                onChange={setGstAmount}
                prefix="₹"
              />
              <SelectField
                label="GST Rate"
                id="gst-rate"
                value={String(gstRate)}
                onChange={(v) => setGstRate(Number(v))}
                options={GST_RATES.map((r) => ({ value: String(r.rate), label: r.label }))}
              />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInterState}
                  onChange={(e) => setIsInterState(e.target.checked)}
                  className="w-4 h-4 rounded border-light-border accent-accent"
                />
                Inter-State supply (IGST)
              </label>
            </div>
            <div className="space-y-3">
              <ResultCard label="Base Amount" value={formatINR(gstResult.baseAmount)} />
              {gstResult.igst > 0 ? (
                <ResultCard label="IGST" value={formatINR(gstResult.igst)} accent />
              ) : (
                <>
                  <ResultCard label="CGST" value={formatINR(gstResult.cgst)} />
                  <ResultCard label="SGST" value={formatINR(gstResult.sgst)} />
                </>
              )}
              <ResultCard label="Total GST" value={formatINR(gstResult.totalGST)} accent />
              <ResultCard label="Total Amount" value={formatINR(gstResult.totalAmount)} highlight />
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{gstResult.type}</p>
            </div>
          </div>

          {/* HSN Lookup */}
          <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-4">HSN Code Lookup</h3>
            <InputField
              id="hsn-search"
              type="text"
              value={hsnSearch}
              onChange={setHsnSearch}
              placeholder="Search by HSN code or description..."
              className="mb-4"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-light-border dark:border-dark-border">
                    <th className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">HSN</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Description</th>
                    <th className="text-right px-4 py-2 text-xs font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHSN.map((h) => (
                    <tr key={h.hsn} className="border-b border-light-border dark:border-dark-border last:border-0">
                      <td className="px-4 py-2.5 font-mono text-accent">{h.hsn}</td>
                      <td className="px-4 py-2.5">{h.description}</td>
                      <td className="px-4 py-2.5 text-right font-medium">{h.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Compliance Tracker */}
      {tab === 'compliance' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {Object.entries(groupedDeadlines).map(([category, items]) => (
            <div key={category} className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary mb-4">{category}</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleCompleted(item.id)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-colors text-left"
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                      completedItems[item.id]
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-light-border dark:border-dark-border'
                    }`}>
                      {completedItems[item.id] && <span className="text-xs">✓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-medium ${completedItems[item.id] ? 'line-through text-light-text-secondary dark:text-dark-text-secondary' : ''}`}>
                          {item.title}
                        </p>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                          {item.deadline}
                        </span>
                      </div>
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-0.5">
                        {item.description} • {item.who}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* MSME Benefits */}
      {tab === 'msme' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-light-text-secondary dark:text-dark-text-secondary">Check MSME Category</h3>
              <InputField label="Investment in Plant & Machinery" id="msme-invest" value={investment} onChange={setInvestment} prefix="₹" />
              <InputField label="Annual Turnover" id="msme-turnover" value={turnover} onChange={setTurnover} prefix="₹" />
              {msmeResult && (
                <div className={`p-4 rounded-xl text-sm font-medium ${
                  msmeResult.eligible
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  Classification: <strong>{msmeResult.category}</strong>
                  {msmeResult.eligible ? ' — Eligible for MSME benefits' : ' — Not eligible for MSME schemes'}
                </div>
              )}
            </div>
          </div>

          {/* Government Schemes */}
          <div>
            <h3 className="text-lg font-semibold tracking-tight mb-4">Government Schemes for Businesses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eligibleSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold">{scheme.name}</h4>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-3">
                    {scheme.benefit}
                  </p>
                  <div className="mb-3">
                    <p className="text-xs font-medium mb-1">Eligibility:</p>
                    <ul className="space-y-0.5">
                      {scheme.eligibility.map((e, i) => (
                        <li key={i} className="text-xs text-light-text-secondary dark:text-dark-text-secondary flex items-start gap-1.5">
                          <span className="text-accent mt-0.5">•</span> {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                  >
                    Visit Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AppShell>
  );
}
