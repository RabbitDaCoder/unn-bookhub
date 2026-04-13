import React from 'react';
import Spinner from './Spinner';

export function FullPageSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        gap: 12,
        color: 'var(--text-1)',
      }}
    >
      <Spinner size={28} />
      <div style={{ color: 'var(--text-3)', fontSize: 14 }}>{label}</div>
    </div>
  );
}

export default FullPageSpinner;
