// components/ui/Disclaimer.jsx
'use client';

import { Info } from 'lucide-react';

export default function Disclaimer({ className = '' }) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-sm text-amber-800 dark:text-amber-300 ${className}`}
    >
      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <p className="leading-relaxed">
        <strong>Disclaimer:</strong> Calculations are for informational purposes
        only and do not constitute financial or tax advice. Tax laws change
        frequently. Always consult a qualified Chartered Accountant or tax
        professional before making financial decisions. All data stays on your
        device and is never sent to any server.
      </p>
    </div>
  );
}
