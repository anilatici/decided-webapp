import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080808',
        surface: '#111111',
        elevated: '#1A1A1A',
        accent: '#C9F231',
        'accent-dim': '#8DB319',
        'text-primary': '#F0EFE8',
        'text-secondary': '#7A7A72',
        'text-dim': '#3A3A36',
        border: '#222220',
        success: '#4ADE80',
        warning: '#FBBF24',
        danger: '#F87171',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        pill: '999px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(201, 242, 49, 0.18), 0 16px 48px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
