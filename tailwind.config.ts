import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        serif: ["Lora", "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        ink: {
          950: "#05050f",
          900: "#09090f",
          800: "#0f0f1a",
          700: "#14142a",
          600: "#1a1a35",
          500: "#1f1f3a",
          400: "#243050",
          300: "#2d3a5a",
        },
        amber: {
          DEFAULT: "#f59e0b",
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        gold: "#fbbf24",
        music: {
          DEFAULT: "#7c3aed",
          light: "#a855f7",
          dark: "#5b21b6",
          glow: "rgba(124,58,237,0.3)",
        },
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(245,158,11,0.12), transparent)",
        "amber-glow":
          "radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)",
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        "book-card":
          "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 100%)",
        "music-bg":
          "linear-gradient(160deg, #080814 0%, #0f0826 50%, #08101a 100%)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      boxShadow: {
        amber: "0 8px 32px rgba(245,158,11,0.18)",
        "amber-lg": "0 20px 60px rgba(245,158,11,0.25)",
        book: "-4px 6px 20px rgba(0,0,0,0.6)",
        music: "0 8px 32px rgba(124,58,237,0.3)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 20px 60px rgba(0,0,0,0.6)",
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "float-slow": "float 7s ease-in-out infinite",
        "float-fast": "float 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.5s ease-out both",
        "slide-up": "slideUp 0.4s ease-out both",
        "slide-right": "slideInRight 0.4s ease-out both",
        "music-pulse": "musicPulse 0.8s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        musicPulse: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(245,158,11,0.2)" },
          "50%": { boxShadow: "0 0 50px rgba(245,158,11,0.5)" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
