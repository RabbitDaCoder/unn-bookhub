import React from 'react';

type Variant = 'amber' | 'success' | 'error' | 'neutral';

export function Badge({ variant = 'neutral', children }: { variant?: Variant; children: React.ReactNode }) {
  const styles: Record<Variant, React.CSSProperties> = {
    amber: {
      background: 'rgba(245,158,11,0.15)',
      color: 'var(--text-amber)',
      border: '1px solid var(--border-amber)',
    },
    success: {
      background: 'rgba(16,185,129,0.12)',
      color: 'var(--success)',
      border: '1px solid rgba(16,185,129,0.25)',
    },
    error: {
      background: 'rgba(248,113,113,0.12)',
      color: 'var(--error)',
      border: '1px solid rgba(248,113,113,0.25)',
    },
    neutral: {
      background: 'var(--layer-05)',
      color: 'var(--text-3)',
      border: '1px solid var(--border-subtle)',
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        ...styles[variant],
      }}
    >
      {children}
    </span>
  );
}

export default Badge;
