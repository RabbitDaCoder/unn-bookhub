import React from 'react';

export type BookCoverSize = 'sm' | 'md' | 'lg' | 'hero';

export interface BookCoverProps {
  courseCode: string;
  title: string;
  color: string;
  size?: BookCoverSize;
}

export function BookCover({ courseCode, title, color, size = 'md' }: BookCoverProps) {
  const sizes = {
    sm: { w: '64px', h: '88px', code: '8px', title: '7px', spine: '5px' },
    md: { w: '120px', h: '168px', code: '11px', title: '9px', spine: '6px' },
    lg: { w: '200px', h: '280px', code: '16px', title: '13px', spine: '10px' },
    hero: { w: '260px', h: '364px', code: '20px', title: '16px', spine: '12px' },
  } as const;

  const s = sizes[size] || sizes.md;

  const darken = (hex: string, amt: number) => {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (n >> 16) - amt);
    const g = Math.max(0, ((n >> 8) & 0xff) - amt);
    const b = Math.max(0, (n & 0xff) - amt);
    return `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        width: s.w,
        height: s.h,
        flexShrink: 0,
        borderRadius: '3px 8px 8px 3px',
        background: `linear-gradient(160deg, ${color} 0%, ${darken(color, 40)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `-3px 3px 8px rgba(0,0,0,0.4), inset -1px 0 3px rgba(0,0,0,0.2)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 8px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: s.spine,
          background: 'rgba(0,0,0,0.25)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '25%',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.07))',
        }}
      />

      {[0.25, 0.75].map((y, i) => (
        <div
          key={y}
          style={{
            position: 'absolute',
            top: `${y * 100}%`,
            left: s.spine,
            right: 0,
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
      ))}

      <span
        style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: s.code,
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          fontFamily: '"JetBrains Mono", monospace',
          marginBottom: '8px',
          zIndex: 1,
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {courseCode}
      </span>

      <span
        style={{
          color: '#ffffff',
          fontSize: s.title,
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.35,
          zIndex: 1,
          position: 'relative',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          padding: '0 4px',
        }}
      >
        {title}
      </span>
    </div>
  );
}

export default BookCover;
