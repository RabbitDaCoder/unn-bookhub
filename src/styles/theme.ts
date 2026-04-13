export const theme = {
  colors: {
    // Backgrounds
    bg: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#273548',
      elevated: '#334155',
    },
    // Borders
    border: {
      subtle: 'rgba(255,255,255,0.06)',
      default: 'rgba(255,255,255,0.10)',
      strong: 'rgba(255,255,255,0.18)',
      amber: 'rgba(245,158,11,0.35)',
    },
    // Text — NEVER use white on dark cards without these
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
      muted: '#64748b',
      amber: '#f59e0b',
      amberLight: '#fcd34d',
      success: '#10b981',
      error: '#f87171',
      warning: '#fbbf24',
    },
    // Accent
    amber: {
      50: 'rgba(245,158,11,0.08)',
      100: 'rgba(245,158,11,0.15)',
      200: 'rgba(245,158,11,0.25)',
      400: '#f59e0b',
      500: '#d97706',
      600: '#b45309',
    },
    // Status
    status: {
      successBg: 'rgba(16,185,129,0.12)',
      successText: '#10b981',
      errorBg: 'rgba(248,113,113,0.12)',
      errorText: '#f87171',
      warningBg: 'rgba(251,191,36,0.12)',
      warningText: '#fbbf24',
      infoBg: 'rgba(99,102,241,0.12)',
      infoText: '#818cf8',
    }
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  shadow: {
    card: '0 4px 24px rgba(0,0,0,0.25)',
    cardHover: '0 20px 48px rgba(0,0,0,0.45)',
    amber: '0 8px 32px rgba(245,158,11,0.2)',
  }
};
