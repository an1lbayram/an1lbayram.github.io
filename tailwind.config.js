import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        success: { DEFAULT: 'hsl(var(--success))', foreground: 'hsl(var(--success-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      /* Tipografi olcegi — 1.25 modular, display boyutlarinda siki tracking */
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.01em' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.625rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.375rem', { lineHeight: '1.875rem', letterSpacing: '-0.005em' }],
        '2xl': ['1.75rem', { lineHeight: '2.125rem', letterSpacing: '-0.015em' }],
        '3xl': ['2.1875rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        '5xl': ['3.4375rem', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        '6xl': ['4.3rem', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        '7xl': ['5.375rem', { lineHeight: '0.98', letterSpacing: '-0.04em' }],
      },
      /* 8px tabanli bosluk sistemi:
         Tailwind'in varsayilan olceginde 1 adim = 4px oldugu icin
         yalnizca CIFT adimlar kullanilir (2=8, 4=16, 6=24, 8=32, 10=40, 12=48, 16=64, 20=80).
         Asagidakiler bolum ritmi icin semantik eklerdir. */
      spacing: {
        section: '5rem',      /* 80px */
        'section-lg': '7rem', /* 112px */
        18: '4.5rem',         /* 72px */
        22: '5.5rem',         /* 88px */
      },
      keyframes: {
        'fade-in': { from: { opacity: '0', transform: 'translateY(-10px)' }, to: { opacity: '1', transform: 'none' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        'fade-in': 'fade-in 1s var(--animation-delay, 0s) ease forwards',
        'fade-up': 'fade-up 1s var(--animation-delay, 0s) ease forwards',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
