// components/ui/InputField.jsx
'use client';

export default function InputField({
  label,
  id,
  type = 'number',
  value,
  onChange,
  placeholder = '',
  prefix = '',
  suffix = '',
  helpText = '',
  min,
  max,
  step,
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
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm text-light-text-secondary dark:text-dark-text-secondary pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required={required}
          className={`w-full rounded-xl bg-light-surface dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-secondary/50 dark:placeholder:text-dark-text-secondary/50 text-sm py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow ${
            prefix ? 'pl-8' : 'pl-3.5'
          } ${suffix ? 'pr-12' : 'pr-3.5'}`}
        />
        {suffix && (
          <span className="absolute right-3 text-sm text-light-text-secondary dark:text-dark-text-secondary pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {helpText && (
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
          {helpText}
        </p>
      )}
    </div>
  );
}
