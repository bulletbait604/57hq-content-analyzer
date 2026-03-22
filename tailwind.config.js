/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
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
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // 57 HQ Brand Colors
        cyan: {
          50: '#f0fdff',
          100: '#ccfbff',
          200: '#99f6ff',
          300: '#66e6ff',
          400: '#33d4ff',
          500: '#00ffff', // Primary cyan
          600: '#00e5ff',
          700: '#00ccdd',
          800: '#00b3bb',
          900: '#009999',
        },
        lime: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#00ff00', // Primary lime green
          600: '#00cc00',
          700: '#009900',
          800: '#007700',
          900: '#005500',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'glow-cyan': 'glow-cyan 2s ease-in-out infinite alternate',
        'glow-lime': 'glow-lime 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'glow-cyan': {
          '0%': { boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff' },
          '100%': { boxShadow: '0 0 20px #00ffff, 0 0 30px #00ffff' },
        },
        'glow-lime': {
          '0%': { boxShadow: '0 0 5px #00ff00, 0 0 10px #00ff00' },
          '100%': { boxShadow: '0 0 20px #00ff00, 0 0 30px #00ff00' },
        },
      },
    },
  },
  plugins: [],
}
