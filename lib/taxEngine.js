// lib/taxEngine.js
// Indian Income Tax Calculation Engine — FY 2024-25 (AY 2025-26)

// ─── Old Regime Tax Slabs ───────────────────────────────────────────
const OLD_REGIME_SLABS_BELOW_60 = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.20 },
  { min: 1000000, max: Infinity, rate: 0.30 },
];

const OLD_REGIME_SLABS_60_TO_80 = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.20 },
  { min: 1000000, max: Infinity, rate: 0.30 },
];

const OLD_REGIME_SLABS_ABOVE_80 = [
  { min: 0, max: 500000, rate: 0 },
  { min: 500000, max: 1000000, rate: 0.20 },
  { min: 1000000, max: Infinity, rate: 0.30 },
];

// ─── New Regime Tax Slabs (FY 2024-25) ──────────────────────────────
const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 700000, rate: 0.05 },
  { min: 700000, max: 1000000, rate: 0.10 },
  { min: 1000000, max: 1200000, rate: 0.15 },
  { min: 1200000, max: 1500000, rate: 0.20 },
  { min: 1500000, max: Infinity, rate: 0.30 },
];

// ─── Constants ──────────────────────────────────────────────────────
export const TAX_CONSTANTS = {
  STANDARD_DEDUCTION_OLD: 50000,
  STANDARD_DEDUCTION_NEW: 75000,
  SECTION_80C_LIMIT: 150000,
  SECTION_80D_SELF_LIMIT: 25000,
  SECTION_80D_SELF_SENIOR: 50000,
  SECTION_80D_PARENTS_LIMIT: 25000,
  SECTION_80D_PARENTS_SENIOR: 50000,
  SECTION_80CCD1B_LIMIT: 50000,
  SECTION_80E_NO_LIMIT: Infinity,
  SECTION_80G_LIMIT_PERCENT: 0.10,
  SECTION_80TTA_LIMIT: 10000,
  SECTION_80TTB_LIMIT: 50000,
  HRA_METRO_PERCENT: 0.50,
  HRA_NON_METRO_PERCENT: 0.40,
  HOME_LOAN_INTEREST_LIMIT_SELF: 200000,
  HOME_LOAN_INTEREST_LIMIT_LET_OUT: Infinity,
  CESS_RATE: 0.04,
  REBATE_87A_OLD_LIMIT: 500000,
  REBATE_87A_OLD_MAX: 12500,
  REBATE_87A_NEW_LIMIT: 700000,
  REBATE_87A_NEW_MAX: 25000,
};

// ─── Slab-based Tax Calculation ─────────────────────────────────────
function calculateSlabTax(income, slabs) {
  let tax = 0;
  for (const slab of slabs) {
    if (income <= slab.min) break;
    const taxableInSlab = Math.min(income, slab.max) - slab.min;
    tax += taxableInSlab * slab.rate;
  }
  return Math.round(tax);
}

// ─── Surcharge Calculation ──────────────────────────────────────────
function calculateSurcharge(tax, totalIncome, isNewRegime = false) {
  if (totalIncome <= 5000000) return 0;
  let rate = 0;
  if (totalIncome <= 10000000) rate = 0.10;
  else if (totalIncome <= 20000000) rate = 0.15;
  else if (totalIncome <= 50000000) rate = 0.25;
  else rate = isNewRegime ? 0.25 : 0.37;
  return Math.round(tax * rate);
}

// ─── HRA Exemption Calculator ───────────────────────────────────────
export function calculateHRA({ basicSalary, hra, rentPaid, isMetro }) {
  if (!rentPaid || rentPaid <= 0 || !hra) return 0;
  const metroPercent = isMetro
    ? TAX_CONSTANTS.HRA_METRO_PERCENT
    : TAX_CONSTANTS.HRA_NON_METRO_PERCENT;

  const exemptions = [
    hra,
    metroPercent * basicSalary,
    Math.max(0, rentPaid - 0.10 * basicSalary),
  ];
  return Math.round(Math.min(...exemptions));
}

// ─── Old Regime Tax Calculator ──────────────────────────────────────
export function calculateOldRegimeTax({
  grossIncome,
  age = 30,
  deductions80C = 0,
  deductions80D = 0,
  deductions80DParents = 0,
  deductions80CCD1B = 0,
  deductions80E = 0,
  deductions80G = 0,
  deductions80TTA = 0,
  hraExemption = 0,
  homeLoanInterest = 0,
  otherExemptions = 0,
}) {
  // Standard deduction
  const standardDeduction = TAX_CONSTANTS.STANDARD_DEDUCTION_OLD;

  // Cap deductions at their limits
  const capped80C = Math.min(deductions80C, TAX_CONSTANTS.SECTION_80C_LIMIT);
  const capped80D = Math.min(
    deductions80D,
    age >= 60 ? TAX_CONSTANTS.SECTION_80D_SELF_SENIOR : TAX_CONSTANTS.SECTION_80D_SELF_LIMIT
  );
  const capped80DParents = Math.min(
    deductions80DParents,
    TAX_CONSTANTS.SECTION_80D_PARENTS_LIMIT
  );
  const capped80CCD1B = Math.min(deductions80CCD1B, TAX_CONSTANTS.SECTION_80CCD1B_LIMIT);
  const capped80TTA = Math.min(
    deductions80TTA,
    age >= 60 ? TAX_CONSTANTS.SECTION_80TTB_LIMIT : TAX_CONSTANTS.SECTION_80TTA_LIMIT
  );
  const cappedHomeLoan = Math.min(homeLoanInterest, TAX_CONSTANTS.HOME_LOAN_INTEREST_LIMIT_SELF);

  // Total deductions
  const totalDeductions =
    standardDeduction +
    capped80C +
    capped80D +
    capped80DParents +
    capped80CCD1B +
    deductions80E +
    deductions80G +
    capped80TTA +
    hraExemption +
    cappedHomeLoan +
    otherExemptions;

  // Taxable income
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  // Select slabs based on age
  let slabs;
  if (age >= 80) slabs = OLD_REGIME_SLABS_ABOVE_80;
  else if (age >= 60) slabs = OLD_REGIME_SLABS_60_TO_80;
  else slabs = OLD_REGIME_SLABS_BELOW_60;

  let tax = calculateSlabTax(taxableIncome, slabs);

  // Rebate u/s 87A
  if (taxableIncome <= TAX_CONSTANTS.REBATE_87A_OLD_LIMIT) {
    tax = Math.max(0, tax - TAX_CONSTANTS.REBATE_87A_OLD_MAX);
  }

  // Surcharge
  const surcharge = calculateSurcharge(tax, grossIncome, false);

  // Cess
  const cess = Math.round((tax + surcharge) * TAX_CONSTANTS.CESS_RATE);

  const totalTax = tax + surcharge + cess;

  return {
    grossIncome,
    standardDeduction,
    totalDeductions,
    taxableIncome,
    baseTax: tax,
    surcharge,
    cess,
    totalTax,
    effectiveRate: grossIncome > 0 ? ((totalTax / grossIncome) * 100).toFixed(2) : '0.00',
    deductionBreakdown: {
      standardDeduction,
      section80C: capped80C,
      section80D: capped80D,
      section80DParents: capped80DParents,
      section80CCD1B: capped80CCD1B,
      section80E: deductions80E,
      section80G: deductions80G,
      section80TTA: capped80TTA,
      hraExemption,
      homeLoanInterest: cappedHomeLoan,
      otherExemptions,
    },
  };
}

// ─── New Regime Tax Calculator ──────────────────────────────────────
export function calculateNewRegimeTax({ grossIncome }) {
  const standardDeduction = TAX_CONSTANTS.STANDARD_DEDUCTION_NEW;
  const taxableIncome = Math.max(0, grossIncome - standardDeduction);

  let tax = calculateSlabTax(taxableIncome, NEW_REGIME_SLABS);

  // Rebate u/s 87A for new regime
  if (taxableIncome <= TAX_CONSTANTS.REBATE_87A_NEW_LIMIT) {
    tax = Math.max(0, tax - TAX_CONSTANTS.REBATE_87A_NEW_MAX);
  }

  const surcharge = calculateSurcharge(tax, grossIncome, true);
  const cess = Math.round((tax + surcharge) * TAX_CONSTANTS.CESS_RATE);
  const totalTax = tax + surcharge + cess;

  return {
    grossIncome,
    standardDeduction,
    totalDeductions: standardDeduction,
    taxableIncome,
    baseTax: tax,
    surcharge,
    cess,
    totalTax,
    effectiveRate: grossIncome > 0 ? ((totalTax / grossIncome) * 100).toFixed(2) : '0.00',
  };
}

// ─── Compare Regimes ────────────────────────────────────────────────
export function compareRegimes(userProfile) {
  const oldRegime = calculateOldRegimeTax(userProfile);
  const newRegime = calculateNewRegimeTax(userProfile);

  const savings = oldRegime.totalTax - newRegime.totalTax;
  const recommended = savings > 0 ? 'new' : savings < 0 ? 'old' : 'either';

  return {
    oldRegime,
    newRegime,
    savings: Math.abs(savings),
    recommended,
    recommendedLabel:
      recommended === 'new'
        ? 'New Regime saves you more'
        : recommended === 'old'
        ? 'Old Regime saves you more'
        : 'Both regimes result in same tax',
  };
}

// ─── Deduction Sections Database ────────────────────────────────────
export const DEDUCTION_SECTIONS = [
  {
    id: '80c',
    section: 'Section 80C',
    title: 'Investment Deductions',
    maxLimit: 150000,
    category: 'Investment',
    description: 'Deductions for investments in PPF, ELSS, EPF, LIC, NSC, SSY, 5-year FD, home loan principal, tuition fees, etc.',
    eligibleFor: ['Salaried', 'Self-Employed', 'Business'],
    regime: 'old',
  },
  {
    id: '80ccc',
    section: 'Section 80CCC',
    title: 'Pension Fund Contribution',
    maxLimit: 150000,
    category: 'Investment',
    description: 'Deduction for contribution to pension fund. Combined limit with 80C and 80CCD(1).',
    eligibleFor: ['Salaried', 'Self-Employed'],
    regime: 'old',
  },
  {
    id: '80ccd1',
    section: 'Section 80CCD(1)',
    title: 'NPS Employee Contribution',
    maxLimit: 150000,
    category: 'Investment',
    description: 'Employee contribution to NPS. Part of 80C combined limit of ₹1.5L.',
    eligibleFor: ['Salaried', 'Self-Employed'],
    regime: 'old',
  },
  {
    id: '80ccd1b',
    section: 'Section 80CCD(1B)',
    title: 'Additional NPS Deduction',
    maxLimit: 50000,
    category: 'Investment',
    description: 'Additional ₹50,000 deduction for NPS contribution over and above 80C limit.',
    eligibleFor: ['Salaried', 'Self-Employed', 'Business'],
    regime: 'old',
  },
  {
    id: '80ccd2',
    section: 'Section 80CCD(2)',
    title: 'Employer NPS Contribution',
    maxLimit: null,
    category: 'Investment',
    description: 'Employer contribution to NPS (up to 10% of salary for private, 14% for govt). Available in both regimes.',
    eligibleFor: ['Salaried'],
    regime: 'both',
  },
  {
    id: '80d',
    section: 'Section 80D',
    title: 'Health Insurance Premium',
    maxLimit: 100000,
    category: 'Insurance',
    description: 'Premium for health insurance. Self/family: ₹25,000 (₹50,000 if senior). Parents: ₹25,000 (₹50,000 if senior).',
    eligibleFor: ['Salaried', 'Self-Employed', 'Business'],
    regime: 'old',
  },
  {
    id: '80dd',
    section: 'Section 80DD',
    title: 'Disabled Dependent',
    maxLimit: 125000,
    category: 'Special',
    description: 'Maintenance/medical treatment of disabled dependent. ₹75,000 (40%+ disability) or ₹1,25,000 (80%+ disability).',
    eligibleFor: ['Salaried', 'Self-Employed', 'Business'],
    regime: 'old',
  },
  {
    id: '80ddb',
    section: 'Section 80DDB',
    title: 'Medical Treatment',
    maxLimit: 100000,
    category: 'Special',
    description: 'Treatment of specified diseases (cancer, AIDS, etc.). Up to ₹40,000 or ₹1,00,000 for senior citizens.',
    eligibleFor: ['Salaried', 'Self-Employed', 'Business'],
    regime: 'old',
  },
  {
    id: '80e',
    section: 'Section 80E',
    title: 'Education Loan Interest',
    maxLimit: null,
    category: 'Loans',
    description: 'Interest paid on education loan for higher education. No upper limit. Available for 8 years from start of repayment.',
    eligibleFor: ['Salaried', 'Self-Employed', 'Business'],
    regime: 'old',
  },
  {
    id: '80ee',
    section: 'Section 80EE',
    title: 'Home Loan Interest (First-time)',
    maxLimit: 50000,
    category: 'Loans',
    description: 'Additional deduction for first-time homebuyers. Loan sanctioned between April 2016 – March 2017, property value ≤ ₹50L.',
    eligibleFor: ['Salaried', 'Self-Employed'],
    regime: 'old',
  },
  {
    id: '80eea',
    section: 'Section 80EEA',
    title: 'Affordable Housing Interest',
    maxLimit: 150000,
    category: 'Loans',
    description: 'Additional ₹1.5L deduction for affordable housing. Stamp value ≤ ₹45L, loan sanctioned April 2019 – March 2022.',
    eligibleFor: ['Salaried', 'Self-Employed'],
    regime: 'old',
  },
  {
    id: '80g',
    section: 'Section 80G',
    title: 'Donations',
    maxLimit: null,
    category: 'Donations',
    description: 'Donations to approved funds/charities. 50% or 100% deduction depending on the donee. Some have 10% of income cap.',
    eligibleFor: ['Salaried', 'Self-Employed', 'Business'],
    regime: 'old',
  },
  {
    id: '80gg',
    section: 'Section 80GG',
    title: 'Rent Paid (No HRA)',
    maxLimit: 60000,
    category: 'Income',
    description: 'Deduction for rent paid when HRA is not received. Lower of: ₹5,000/month, 25% of total income, or rent minus 10% of income.',
    eligibleFor: ['Salaried', 'Self-Employed'],
    regime: 'old',
  },
  {
    id: '80tta',
    section: 'Section 80TTA',
    title: 'Savings Account Interest',
    maxLimit: 10000,
    category: 'Income',
    description: 'Interest from savings account up to ₹10,000 for individuals below 60.',
    eligibleFor: ['Salaried', 'Self-Employed', 'Business'],
    regime: 'old',
  },
  {
    id: '80ttb',
    section: 'Section 80TTB',
    title: 'Senior Citizen Interest Income',
    maxLimit: 50000,
    category: 'Income',
    description: 'Interest from deposits (savings, FD, RD) up to ₹50,000 for senior citizens (60+).',
    eligibleFor: ['Salaried', 'Self-Employed'],
    regime: 'old',
  },
  {
    id: '80u',
    section: 'Section 80U',
    title: 'Person with Disability',
    maxLimit: 125000,
    category: 'Special',
    description: 'Deduction for person with disability. ₹75,000 (40%+ disability) or ₹1,25,000 (80%+ disability).',
    eligibleFor: ['Salaried', 'Self-Employed', 'Business'],
    regime: 'old',
  },
  {
    id: 'hra',
    section: 'HRA Exemption',
    title: 'House Rent Allowance',
    maxLimit: null,
    category: 'Income',
    description: 'Exemption for HRA. Lowest of: actual HRA, 50%/40% of basic salary (metro/non-metro), or rent paid minus 10% of basic.',
    eligibleFor: ['Salaried'],
    regime: 'old',
  },
  {
    id: 'lta',
    section: 'LTA Exemption',
    title: 'Leave Travel Allowance',
    maxLimit: null,
    category: 'Income',
    description: 'Exemption for domestic travel expenses. Actual travel cost, economy class air fare, or AC first class rail fare.',
    eligibleFor: ['Salaried'],
    regime: 'old',
  },
  {
    id: 'home_loan_interest',
    section: 'Section 24(b)',
    title: 'Home Loan Interest',
    maxLimit: 200000,
    category: 'Loans',
    description: 'Interest on home loan for self-occupied property up to ₹2,00,000. No limit for let-out property.',
    eligibleFor: ['Salaried', 'Self-Employed', 'Business'],
    regime: 'old',
  },
  {
    id: 'home_loan_principal',
    section: 'Section 80C (Principal)',
    title: 'Home Loan Principal Repayment',
    maxLimit: 150000,
    category: 'Loans',
    description: 'Principal repayment of home loan. Part of 80C combined limit of ₹1.5L.',
    eligibleFor: ['Salaried', 'Self-Employed', 'Business'],
    regime: 'old',
  },
];

// ─── AI Recommendation Engine ───────────────────────────────────────
export function generateRecommendations(profile) {
  const recommendations = [];
  const { grossIncome, age = 30, deductions80C = 0, deductions80D = 0, deductions80CCD1B = 0, homeLoanInterest = 0, hraExemption = 0, rentPaid = 0, basicSalary = 0, isMetro = false } = profile;

  // 1. Check 80C gap
  const gap80C = TAX_CONSTANTS.SECTION_80C_LIMIT - Math.min(deductions80C, TAX_CONSTANTS.SECTION_80C_LIMIT);
  if (gap80C > 0) {
    recommendations.push({
      id: 'max-80c',
      priority: 'high',
      title: 'Maximize Section 80C',
      description: `You can save more by investing ₹${gap80C.toLocaleString('en-IN')} in 80C instruments like ELSS, PPF, or NPS.`,
      potentialSaving: Math.round(gap80C * 0.3),
      action: 'Invest in ELSS mutual funds for best returns with shortest lock-in (3 years).',
      section: '80C',
    });
  }

  // 2. Check 80D
  const limit80D = age >= 60 ? TAX_CONSTANTS.SECTION_80D_SELF_SENIOR : TAX_CONSTANTS.SECTION_80D_SELF_LIMIT;
  const gap80D = limit80D - Math.min(deductions80D, limit80D);
  if (gap80D > 0) {
    recommendations.push({
      id: 'health-insurance',
      priority: 'high',
      title: 'Get Health Insurance (80D)',
      description: `You can claim up to ₹${limit80D.toLocaleString('en-IN')} for health insurance premiums.`,
      potentialSaving: Math.round(gap80D * 0.3),
      action: 'Buy a health insurance plan with at least ₹5L cover for your family.',
      section: '80D',
    });
  }

  // 3. Check NPS 80CCD(1B)
  if (deductions80CCD1B < TAX_CONSTANTS.SECTION_80CCD1B_LIMIT) {
    const gap = TAX_CONSTANTS.SECTION_80CCD1B_LIMIT - deductions80CCD1B;
    recommendations.push({
      id: 'nps-extra',
      priority: 'medium',
      title: 'Additional NPS Deduction (80CCD1B)',
      description: `Invest ₹${gap.toLocaleString('en-IN')} in NPS for an additional deduction beyond 80C.`,
      potentialSaving: Math.round(gap * 0.3),
      action: 'Open an NPS Tier 1 account and invest up to ₹50,000 for extra tax benefit.',
      section: '80CCD(1B)',
    });
  }

  // 4. Check HRA optimization
  if (rentPaid > 0 && basicSalary > 0 && hraExemption === 0) {
    const potentialHRA = calculateHRA({ basicSalary, hra: basicSalary * 0.5, rentPaid, isMetro });
    if (potentialHRA > 0) {
      recommendations.push({
        id: 'claim-hra',
        priority: 'high',
        title: 'Claim HRA Exemption',
        description: `You pay rent but haven't claimed HRA. Potential exemption: ₹${potentialHRA.toLocaleString('en-IN')}.`,
        potentialSaving: Math.round(potentialHRA * 0.3),
        action: 'Submit rent receipts and landlord PAN to your employer. Keep receipts for the full year.',
        section: 'HRA',
      });
    }
  }

  // 5. Home loan interest
  if (homeLoanInterest > 0 && homeLoanInterest < TAX_CONSTANTS.HOME_LOAN_INTEREST_LIMIT_SELF) {
    recommendations.push({
      id: 'home-loan',
      priority: 'low',
      title: 'Home Loan Interest Deduction',
      description: `You can claim up to ₹2,00,000 for home loan interest under Section 24(b).`,
      potentialSaving: Math.round(
        (TAX_CONSTANTS.HOME_LOAN_INTEREST_LIMIT_SELF - homeLoanInterest) * 0.3
      ),
      action: 'Ensure you claim the full interest component from your home loan statement.',
      section: '24(b)',
    });
  }

  // 6. Regime comparison
  const comparison = compareRegimes(profile);
  if (comparison.savings > 0) {
    recommendations.push({
      id: 'regime-switch',
      priority: 'high',
      title: `Switch to ${comparison.recommended === 'new' ? 'New' : 'Old'} Regime`,
      description: `The ${comparison.recommended === 'new' ? 'New' : 'Old'} Regime saves you ₹${comparison.savings.toLocaleString('en-IN')} more.`,
      potentialSaving: comparison.savings,
      action: `Choose the ${comparison.recommended === 'new' ? 'New' : 'Old'} Regime when filing your ITR.`,
      section: 'Regime',
    });
  }

  // 7. Education loan
  if (grossIncome >= 500000 && grossIncome <= 1500000) {
    recommendations.push({
      id: 'education-loan',
      priority: 'low',
      title: 'Education Loan Interest (80E)',
      description: 'If you have an education loan, the entire interest amount is deductible with no upper limit.',
      potentialSaving: 0,
      action: 'Check if you or your children have education loans — claim interest under 80E.',
      section: '80E',
    });
  }

  // 8. Savings account interest
  recommendations.push({
    id: 'savings-interest',
    priority: 'low',
    title: 'Savings Account Interest (80TTA)',
    description: `Claim up to ₹${(age >= 60 ? 50000 : 10000).toLocaleString('en-IN')} for savings account interest.`,
    potentialSaving: age >= 60 ? 15000 : 3000,
    action: 'Declare your savings account interest and claim the deduction.',
    section: age >= 60 ? '80TTB' : '80TTA',
  });

  // Sort by potential saving (high to low)
  recommendations.sort((a, b) => b.potentialSaving - a.potentialSaving);

  // Calculate total potential savings
  const totalPotentialSaving = recommendations.reduce((sum, r) => sum + r.potentialSaving, 0);

  return { recommendations, totalPotentialSaving };
}

// ─── Format currency ────────────────────────────────────────────────
export function formatINR(amount) {
  if (amount === null || amount === undefined) return '—';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}
