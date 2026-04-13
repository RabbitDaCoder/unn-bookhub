import React from 'react';

export function Card({ children, padding = 20, style }: { children: React.ReactNode; padding?: number; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--r-xl)',
        padding,
        boxShadow: 'var(--shadow-card)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;
