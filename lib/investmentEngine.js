// lib/investmentEngine.js
// Investment Calculation Engine for Tax-Saving Instruments

// ─── Investment Instruments Database ────────────────────────────────
export const INSTRUMENTS = [
  {
    id: 'elss',
    name: 'ELSS Mutual Funds',
    fullName: 'Equity Linked Saving Scheme',
    lockIn: '3 years',
    lockInYears: 3,
    expectedReturn: { min: 12, max: 15, avg: 13 },
    taxOnGains: 'LTCG > ₹1.25L taxed at 12.5%',
    section80C: true,
    riskLevel: 'High',
    liquidity: 'After 3 years',
    minInvestment: 500,
    description: 'Best for aggressive investors seeking high returns with tax benefits. Shortest lock-in among 80C instruments.',
  },
  {
    id: 'ppf',
    name: 'PPF',
    fullName: 'Public Provident Fund',
    lockIn: '15 years',
    lockInYears: 15,
    expectedReturn: { min: 7, max: 7.1, avg: 7.1 },
    taxOnGains: 'Fully tax-free (EEE)',
    section80C: true,
    riskLevel: 'Zero',
    liquidity: 'Partial after 7 years',
    minInvestment: 500,
    description: 'Government-backed, guaranteed returns, completely tax-free. Best for risk-averse investors.',
  },
  {
    id: 'nps',
    name: 'NPS',
    fullName: 'National Pension System',
    lockIn: 'Till 60',
    lockInYears: 30,
    expectedReturn: { min: 9, max: 12, avg: 10 },
    taxOnGains: '60% tax-free on maturity, 40% annuity taxable',
    section80C: true,
    additional80CCD1B: true,
    riskLevel: 'Medium',
    liquidity: 'At retirement (partial withdrawal allowed)',
    minInvestment: 500,
    description: 'Extra ₹50,000 deduction under 80CCD(1B). Best for long-term retirement planning.',
  },
  {
    id: 'fd5',
    name: '5-Year Tax Saver FD',
    fullName: 'Tax Saving Fixed Deposit',
    lockIn: '5 years',
    lockInYears: 5,
    expectedReturn: { min: 7, max: 7.5, avg: 7.25 },
    taxOnGains: 'Interest fully taxable',
    section80C: true,
    riskLevel: 'Zero',
    liquidity: 'After 5 years',
    minInvestment: 1000,
    description: 'Bank FD with 80C benefit. Interest is taxable, making effective returns low for high-income earners.',
  },
  {
    id: 'ssy',
    name: 'SSY',
    fullName: 'Sukanya Samriddhi Yojana',
    lockIn: '21 years',
    lockInYears: 21,
    expectedReturn: { min: 8, max: 8.2, avg: 8.2 },
    taxOnGains: 'Fully tax-free (EEE)',
    section80C: true,
    riskLevel: 'Zero',
    liquidity: 'At maturity or girl child marriage',
    minInvestment: 250,
    description: 'For girl child. High interest rate, fully tax-free. One of the best government schemes.',
  },
  {
    id: 'ulip',
    name: 'ULIP',
    fullName: 'Unit Linked Insurance Plan',
    lockIn: '5 years',
    lockInYears: 5,
    expectedReturn: { min: 8, max: 12, avg: 10 },
    taxOnGains: 'Tax-free if annual premium ≤ ₹2.5L',
    section80C: true,
    riskLevel: 'Medium-High',
    liquidity: 'After 5 years',
    minInvestment: 5000,
    description: 'Insurance + investment. Higher charges than mutual funds. Only consider if premium ≤ ₹2.5L/year.',
  },
  {
    id: 'epf',
    name: 'EPF',
    fullName: 'Employee Provident Fund',
    lockIn: 'Till retirement',
    lockInYears: 30,
    expectedReturn: { min: 8, max: 8.25, avg: 8.15 },
    taxOnGains: 'Tax-free (interest on contribution > ₹2.5L is taxable)',
    section80C: true,
    riskLevel: 'Zero',
    liquidity: 'Partial withdrawal for specific needs',
    minInvestment: null,
    description: 'Mandatory for salaried. Employer matches contribution. One of the safest investments.',
  },
  {
    id: 'nsc',
    name: 'NSC',
    fullName: 'National Savings Certificate',
    lockIn: '5 years',
    lockInYears: 5,
    expectedReturn: { min: 7.7, max: 7.7, avg: 7.7 },
    taxOnGains: 'Interest taxable (but reinvested interest qualifies for 80C)',
    section80C: true,
    riskLevel: 'Zero',
    liquidity: 'At maturity',
    minInvestment: 1000,
    description: 'Post office scheme with guaranteed returns. Interest reinvested qualifies for 80C each year.',
  },
];

// ─── SIP Future Value Calculator ────────────────────────────────────
export function calculateSIPFutureValue({
  monthlyAmount,
  expectedReturnPercent,
  durationYears,
}) {
  const monthlyRate = expectedReturnPercent / 100 / 12;
  const totalMonths = durationYears * 12;
  const totalInvested = monthlyAmount * totalMonths;

  // FV = P × [(1+r)^n - 1] / r × (1+r)
  const futureValue =
    monthlyAmount *
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
    (1 + monthlyRate);

  const wealthGained = futureValue - totalInvested;

  return {
    monthlyAmount,
    totalInvested: Math.round(totalInvested),
    futureValue: Math.round(futureValue),
    wealthGained: Math.round(wealthGained),
    returnPercent: expectedReturnPercent,
    durationYears,
  };
}

// ─── Lump Sum Future Value ──────────────────────────────────────────
export function calculateLumpSumFutureValue({
  amount,
  expectedReturnPercent,
  durationYears,
}) {
  const futureValue = amount * Math.pow(1 + expectedReturnPercent / 100, durationYears);
  return {
    amount,
    futureValue: Math.round(futureValue),
    wealthGained: Math.round(futureValue - amount),
    returnPercent: expectedReturnPercent,
    durationYears,
  };
}

// ─── NPS Retirement Calculator ──────────────────────────────────────
export function calculateNPSCorpus({
  currentAge,
  retirementAge = 60,
  monthlyContribution,
  expectedReturnPercent = 10,
}) {
  const yearsToRetirement = retirementAge - currentAge;
  if (yearsToRetirement <= 0) return null;

  const sip = calculateSIPFutureValue({
    monthlyAmount: monthlyContribution,
    expectedReturnPercent,
    durationYears: yearsToRetirement,
  });

  const taxFreeWithdrawal = Math.round(sip.futureValue * 0.6);
  const annuityPortion = Math.round(sip.futureValue * 0.4);
  const monthlyPension = Math.round((annuityPortion * 0.06) / 12);

  const yearlyDeduction = Math.min(monthlyContribution * 12, 50000);
  const taxSavedPerYear = Math.round(yearlyDeduction * 0.3);
  const totalTaxSaved = taxSavedPerYear * yearsToRetirement;

  return {
    ...sip,
    yearsToRetirement,
    taxFreeWithdrawal,
    annuityPortion,
    estimatedMonthlyPension: monthlyPension,
    yearlyTaxBenefit: yearlyDeduction,
    taxSavedPerYear,
    totalTaxSaved,
  };
}

// ─── 80C Gap Analyzer ───────────────────────────────────────────────
export function analyze80CGap({
  epfContribution = 0,
  ppfContribution = 0,
  elssInvestment = 0,
  lifeInsurancePremium = 0,
  homeLoanPrincipal = 0,
  tuitionFees = 0,
  nscInvestment = 0,
  fdInvestment = 0,
  otherInvestments = 0,
}) {
  const limit = 150000;
  const contributions = {
    'EPF Contribution': epfContribution,
    'PPF Contribution': ppfContribution,
    'ELSS Investment': elssInvestment,
    'Life Insurance Premium': lifeInsurancePremium,
    'Home Loan Principal': homeLoanPrincipal,
    'Tuition Fees': tuitionFees,
    'NSC Investment': nscInvestment,
    'Tax Saver FD': fdInvestment,
    'Other 80C Investments': otherInvestments,
  };

  const total = Object.values(contributions).reduce((sum, val) => sum + val, 0);
  const utilized = Math.min(total, limit);
  const gap = Math.max(0, limit - total);
  const overLimit = Math.max(0, total - limit);

  return {
    contributions,
    total,
    limit,
    utilized,
    gap,
    overLimit,
    utilizationPercent: Math.round((utilized / limit) * 100),
    recommendedInstruments: gap > 0
      ? INSTRUMENTS.filter((i) => i.section80C).map((i) => ({
          id: i.id,
          name: i.name,
          suggestedAmount: Math.min(gap, gap),
          expectedReturn: i.expectedReturn.avg,
          lockIn: i.lockIn,
          risk: i.riskLevel,
        }))
      : [],
  };
}

// ─── Tax on Capital Gains ───────────────────────────────────────────
export function calculateCapitalGainsTax({
  gains,
  holdingPeriod,
  instrumentType = 'equity',
}) {
  if (instrumentType === 'equity') {
    if (holdingPeriod >= 12) {
      // LTCG
      const taxableGains = Math.max(0, gains - 125000);
      return {
        type: 'LTCG',
        exemption: 125000,
        taxableGains,
        taxRate: 12.5,
        tax: Math.round(taxableGains * 0.125),
      };
    } else {
      // STCG
      return {
        type: 'STCG',
        exemption: 0,
        taxableGains: gains,
        taxRate: 20,
        tax: Math.round(gains * 0.20),
      };
    }
  } else {
    // Debt funds — taxed at slab rate
    return {
      type: 'Slab Rate',
      exemption: 0,
      taxableGains: gains,
      taxRate: null,
      tax: null,
      note: 'Taxed at your income tax slab rate',
    };
  }
}
