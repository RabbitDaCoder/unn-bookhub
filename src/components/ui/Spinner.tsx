import React from 'react';

export function Spinner({ size = 18 }: { size?: number }) {
  const thickness = Math.max(2, Math.round(size / 9));
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${thickness}px solid var(--layer-08)`,
        borderTopColor: 'var(--amber-400)',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}

export default Spinner;
