// lib/gstEngine.js
// GST Calculation Engine

export const GST_RATES = [
  { rate: 0, label: 'Exempt (0%)' },
  { rate: 5, label: '5%' },
  { rate: 12, label: '12%' },
  { rate: 18, label: '18%' },
  { rate: 28, label: '28%' },
];

export function calculateGST({ amount, rate, isInterState = false }) {
  const gstAmount = Math.round((amount * rate) / 100);
  const total = amount + gstAmount;
  if (isInterState) {
    return { baseAmount: amount, gstRate: rate, igst: gstAmount, cgst: 0, sgst: 0, totalGST: gstAmount, totalAmount: total, type: 'IGST (Inter-State)' };
  }
  const halfGST = Math.round(gstAmount / 2);
  return { baseAmount: amount, gstRate: rate, igst: 0, cgst: halfGST, sgst: halfGST, totalGST: halfGST * 2, totalAmount: amount + halfGST * 2, type: 'CGST + SGST (Intra-State)' };
}

export function reverseCalculateGST({ totalAmount, rate, isInterState = false }) {
  const baseAmount = Math.round((totalAmount * 100) / (100 + rate));
  const gstAmount = totalAmount - baseAmount;
  if (isInterState) {
    return { baseAmount, gstRate: rate, igst: gstAmount, cgst: 0, sgst: 0, totalGST: gstAmount, totalAmount, type: 'IGST (Inter-State)' };
  }
  const halfGST = Math.round(gstAmount / 2);
  return { baseAmount, gstRate: rate, igst: 0, cgst: halfGST, sgst: halfGST, totalGST: gstAmount, totalAmount, type: 'CGST + SGST (Intra-State)' };
}

export function calculateInputCredit({ gstPaid, gstCollected }) {
  const credit = gstPaid - gstCollected;
  return { gstPaid, gstCollected, inputCredit: Math.max(0, credit), gstPayable: Math.max(0, -credit), status: credit > 0 ? 'Refund due' : credit < 0 ? 'Tax payable' : 'Settled' };
}

export const HSN_CODES = [
  { hsn: '0401', description: 'Milk and cream', rate: 0 },
  { hsn: '0713', description: 'Dried vegetables, pulses', rate: 0 },
  { hsn: '1001', description: 'Wheat', rate: 0 },
  { hsn: '1006', description: 'Rice', rate: 0 },
  { hsn: '1701', description: 'Sugar', rate: 5 },
  { hsn: '1905', description: 'Bakery products, biscuits', rate: 18 },
  { hsn: '2201', description: 'Packaged drinking water', rate: 18 },
  { hsn: '2202', description: 'Aerated drinks', rate: 28 },
  { hsn: '3004', description: 'Medicines, pharmaceuticals', rate: 12 },
  { hsn: '3304', description: 'Cosmetics, beauty products', rate: 28 },
  { hsn: '3401', description: 'Soap, detergents', rate: 18 },
  { hsn: '6109', description: 'T-shirts, cotton garments', rate: 5 },
  { hsn: '6203', description: 'Mens suits, trousers', rate: 12 },
  { hsn: '6403', description: 'Footwear (above Rs.1000)', rate: 18 },
  { hsn: '7113', description: 'Gold jewellery', rate: 3 },
  { hsn: '8471', description: 'Computers, laptops', rate: 18 },
  { hsn: '8517', description: 'Mobile phones', rate: 18 },
  { hsn: '8528', description: 'TVs, monitors', rate: 18 },
  { hsn: '8703', description: 'Motor cars (small)', rate: 28 },
  { hsn: '8711', description: 'Motorcycles', rate: 28 },
  { hsn: '9401', description: 'Furniture, seats', rate: 18 },
  { hsn: '9503', description: 'Toys', rate: 12 },
  { hsn: '9954', description: 'Construction services', rate: 18 },
  { hsn: '9971', description: 'Rental of property', rate: 18 },
  { hsn: '9983', description: 'Professional services', rate: 18 },
  { hsn: '9992', description: 'Education services', rate: 0 },
  { hsn: '9993', description: 'Healthcare services', rate: 0 },
  { hsn: '9996', description: 'Transportation services', rate: 5 },
  { hsn: '9997', description: 'IT/Software services', rate: 18 },
];

export const COMPLIANCE_DEADLINES = [
  { id: 'advance-q1', title: 'Advance Tax Q1', deadline: 'June 15', description: 'Pay 15% of estimated annual tax', category: 'Income Tax', who: 'Tax liability > Rs.10,000' },
  { id: 'advance-q2', title: 'Advance Tax Q2', deadline: 'September 15', description: 'Pay 45% cumulative', category: 'Income Tax', who: 'Tax liability > Rs.10,000' },
  { id: 'advance-q3', title: 'Advance Tax Q3', deadline: 'December 15', description: 'Pay 75% cumulative', category: 'Income Tax', who: 'Tax liability > Rs.10,000' },
  { id: 'advance-q4', title: 'Advance Tax Q4', deadline: 'March 15', description: 'Pay 100%', category: 'Income Tax', who: 'Tax liability > Rs.10,000' },
  { id: 'itr-individual', title: 'ITR Filing (Individuals)', deadline: 'July 31', description: 'Income tax return for non-audit cases', category: 'Income Tax', who: 'Salaried, freelancers' },
  { id: 'itr-audit', title: 'ITR Filing (Audit)', deadline: 'October 31', description: 'Tax return for audit cases', category: 'Income Tax', who: 'Turnover > Rs.1Cr' },
  { id: 'belated-itr', title: 'Belated/Revised ITR', deadline: 'December 31', description: 'Last date for belated/revised return', category: 'Income Tax', who: 'Missed original deadline' },
  { id: 'gstr1', title: 'GSTR-1 Monthly', deadline: '11th of next month', description: 'Outward supplies return', category: 'GST', who: 'Turnover > Rs.5Cr' },
  { id: 'gstr3b', title: 'GSTR-3B Monthly', deadline: '20th of next month', description: 'Summary return and tax payment', category: 'GST', who: 'All GST registered' },
  { id: 'gstr9', title: 'GSTR-9 Annual', deadline: 'December 31', description: 'Annual GST return', category: 'GST', who: 'All GST registered' },
  { id: 'tds-payment', title: 'TDS Payment', deadline: '7th of next month', description: 'Deposit TDS deducted', category: 'TDS', who: 'All TDS deductors' },
  { id: 'tds-quarterly', title: 'TDS Quarterly Return', deadline: 'Jul 31/Oct 31/Jan 31/May 31', description: 'Quarterly TDS filing', category: 'TDS', who: 'All TDS deductors' },
];

export function classifyMSME({ investmentInPlant, annualTurnover }) {
  if (investmentInPlant <= 10000000 && annualTurnover <= 50000000) return { category: 'Micro', eligible: true };
  if (investmentInPlant <= 100000000 && annualTurnover <= 500000000) return { category: 'Small', eligible: true };
  if (investmentInPlant <= 500000000 && annualTurnover <= 2500000000) return { category: 'Medium', eligible: true };
  return { category: 'Large (Not MSME)', eligible: false };
}
