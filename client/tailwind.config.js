/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-light': 'var(--color-primary-light)',

        // Accent / Gold
        accent: 'var(--color-accent)',
        'accent-dark': 'var(--color-accent-dark)',
        'accent-light': 'var(--color-accent-light)',

        // Highlight
        highlight: 'var(--color-highlight)',
        'highlight-soft': 'var(--color-highlight-soft)',

        // Semantic
        success: 'var(--color-success)',
        'success-light': 'var(--color-success-light)',
        warning: 'var(--color-warning)',
        'warning-light': 'var(--color-warning-light)',
        danger: 'var(--color-danger)',
        'danger-light': 'var(--color-danger-light)',

        // Neutral
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        'border-soft': 'var(--color-border-soft)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-subtle': 'var(--color-text-subtle)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        gold: 'var(--shadow-gold)',
      },
      fontFamily: {
        sans: ['Noto Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
