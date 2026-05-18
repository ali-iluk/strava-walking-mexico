import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        sage: 'var(--color-sage)',
        terracotta: 'var(--color-terracotta)',
        sky: 'var(--color-sky)',
        blush: 'var(--color-blush)',
      },
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(74, 69, 67, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
