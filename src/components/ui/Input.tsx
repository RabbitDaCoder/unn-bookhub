import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
  requiredMark?: boolean;
}

export function Input({ label, helper, requiredMark, style, ...rest }: InputProps) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {label && (
        <span
          style={{
            color: 'var(--text-3)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
          }}
        >
          {label} {requiredMark && <span style={{ color: 'var(--error)' }}>*</span>}
        </span>
      )}
      <input
        {...rest}
        style={{
          background: 'var(--bg-base)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--r-md)',
          color: 'var(--text-1)',
          padding: '11px 14px',
          fontSize: 14,
          outline: 'none',
          width: '100%',
          transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--amber-400)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)';
          e.currentTarget.style.background = 'var(--bg-tertiary)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-default)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.background = 'var(--bg-base)';
        }}
      />
      {helper && <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{helper}</span>}
    </label>
  );
}

export default Input;
