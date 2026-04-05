// components/ui/SelectField.jsx
'use client';

export default function SelectField({
  label,
  id,
  value,
  onChange,
  options = [],
  helpText = '',
  required = false,
  className = '',
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl bg-light-surface dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helpText && (
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
          {helpText}
        </p>
      )}
    </div>
  );
}
