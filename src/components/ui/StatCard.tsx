import React from 'react';
import Badge from './Badge';

export function StatCard({ icon, label, value, hint }: { icon?: React.ReactNode; label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(245,158,11,0.1)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--text-amber)',
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
          <div style={{ color: 'var(--text-1)', fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{value}</div>
        </div>
      </div>
      {hint && <Badge variant="neutral">{hint}</Badge>}
    </div>
  );
}

export default StatCard;
