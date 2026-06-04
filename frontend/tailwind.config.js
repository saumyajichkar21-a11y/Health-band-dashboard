/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#0f172a',
          secondary: '#1e293b',
          tertiary:  '#0f172a',
          card:      '#1e293b',
          hover:     '#334155',
        },
        brand: {
          cyan:   '#06b6d4',
          purple: '#8b5cf6',
        },
        status: {
          success: '#22c55e',
          warning: '#f59e0b',
          danger:  '#ef4444',
          info:    '#06b6d4',
        },
        txt: {
          primary:   '#f1f5f9',
          secondary: '#94a3b8',
          muted:     '#475569',
        },
        border: {
          DEFAULT: '#334155',
          subtle:  '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'ping-slow':  'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'flash':      'flash 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        flash: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
};
