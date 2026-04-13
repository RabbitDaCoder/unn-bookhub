import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const colors: Record<Variant, { bg: string; color: string; border?: string; hover?: string }> = {
    primary: {
      bg: 'linear-gradient(135deg, var(--amber-400), var(--amber-500))',
      color: '#0f172a',
      hover: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))',
    },
    secondary: {
      bg: 'var(--bg-elevated)',
      color: 'var(--text-1)',
      border: '1px solid var(--border-default)',
      hover: 'var(--bg-card-hover)',
    },
    ghost: {
      bg: 'transparent',
      color: 'var(--text-1)',
      hover: 'var(--layer-05)',
      border: '1px solid var(--border-subtle)',
    },
    danger: {
      bg: 'rgba(248,113,113,0.14)',
      color: 'var(--error)',
      border: '1px solid rgba(248,113,113,0.4)',
      hover: 'rgba(248,113,113,0.22)',
    },
  };

  const sizes: Record<Size, { py: number; px: number; fs: number; rd: string }> = {
    sm: { py: 8, px: 12, fs: 13, rd: '10px' },
    md: { py: 12, px: 14, fs: 14, rd: '12px' },
    lg: { py: 14, px: 16, fs: 15, rd: '12px' },
  };

  const c = colors[variant];
  const s = sizes[size];

  const base: React.CSSProperties = {
    background: c.bg,
    color: c.color,
    border: c.border,
    padding: `${s.py}px ${s.px}px`,
    borderRadius: s.rd,
    fontWeight: 700,
    fontSize: s.fs,
    width: fullWidth ? '100%' : undefined,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
    boxShadow: variant === 'primary' ? '0 10px 30px rgba(245,158,11,0.25)' : undefined,
  };

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      style={{ ...base, ...style }}
      onMouseEnter={(e) => {
        if (c.hover) e.currentTarget.style.background = c.hover;
      }}
      onMouseLeave={(e) => {
        if (c.hover) e.currentTarget.style.background = c.bg;
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(1px)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {loading ? '···' : children}
    </button>
  );
}

export default Button;
