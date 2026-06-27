/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        saffron: 'var(--accent-saffron)',
        teal: 'var(--accent-teal)',
        success: 'var(--accent-green)',
        danger: 'var(--accent-red)',
        amber: 'var(--accent-amber)',
        'text-primary': 'var(--text-primary)',
        muted: 'var(--text-muted)',
        border: 'var(--border)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      minWidth: {
        dashboard: '1024px',
      },
    },
  },
  plugins: [],
};
