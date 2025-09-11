import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
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
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          950: 'hsl(var(--primary-950))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Custom brand colors for headless architecture
        brand: {
          50: 'hsl(var(--brand-50))',
          100: 'hsl(var(--brand-100))',
          200: 'hsl(var(--brand-200))',
          300: 'hsl(var(--brand-300))',
          400: 'hsl(var(--brand-400))',
          500: 'hsl(var(--brand-500))',
          600: 'hsl(var(--brand-600))',
          700: 'hsl(var(--brand-700))',
          800: 'hsl(var(--brand-800))',
          900: 'hsl(var(--brand-900))',
          950: 'hsl(var(--brand-950))',
        },
        neutral: {
          50: 'hsl(var(--neutral-50))',
          100: 'hsl(var(--neutral-100))',
          200: 'hsl(var(--neutral-200))',
          300: 'hsl(var(--neutral-300))',
          400: 'hsl(var(--neutral-400))',
          500: 'hsl(var(--neutral-500))',
          600: 'hsl(var(--neutral-600))',
          700: 'hsl(var(--neutral-700))',
          800: 'hsl(var(--neutral-800))',
          900: 'hsl(var(--neutral-900))',
          950: 'hsl(var(--neutral-950))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        serif: [
          'var(--font-serif)',
          'Crimson Pro',
          'Lora',
          'ui-serif',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Times',
          'serif',
        ],
        mono: [
          'var(--font-mono)',
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
        heading: [
          'var(--font-heading)',
          'Inter',
          'var(--font-sans)',
        ],
        display: [
          'var(--font-display)',
          'Cal Sans',
          'Inter',
          'var(--font-sans)',
        ],
      },
      fontSize: {
        // Base text sizes with optimal line heights for readability
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.016em' }],
        'base': ['1rem', { lineHeight: '1.625rem', letterSpacing: '0.012em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.008em' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '0.004em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.008em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.016em' }],
        '5xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.024em' }],
        '6xl': ['3.75rem', { lineHeight: '4rem', letterSpacing: '-0.032em' }],
        '7xl': ['4.5rem', { lineHeight: '4.75rem', letterSpacing: '-0.04em' }],
        '8xl': ['6rem', { lineHeight: '6.25rem', letterSpacing: '-0.048em' }],
        '9xl': ['8rem', { lineHeight: '8.25rem', letterSpacing: '-0.056em' }],
        
        // Display typography - optimized for hero sections and large headings
        'display-2xl': [
          'clamp(3.5rem, 5vw + 2rem, 7rem)',
          {
            lineHeight: '1.1',
            letterSpacing: '-0.04em',
            fontWeight: '700'
          }
        ],
        'display-xl': [
          'clamp(2.75rem, 4vw + 1.5rem, 5rem)',
          {
            lineHeight: '1.15',
            letterSpacing: '-0.032em',
            fontWeight: '700'
          }
        ],
        'display-lg': [
          'clamp(2.25rem, 3.5vw + 1rem, 3.75rem)',
          {
            lineHeight: '1.2',
            letterSpacing: '-0.024em',
            fontWeight: '600'
          }
        ],
        'display-md': [
          'clamp(1.875rem, 2.5vw + 0.75rem, 2.75rem)',
          {
            lineHeight: '1.3',
            letterSpacing: '-0.016em',
            fontWeight: '600'
          }
        ],
        'display-sm': [
          'clamp(1.5rem, 2vw + 0.5rem, 2.25rem)',
          {
            lineHeight: '1.4',
            letterSpacing: '-0.008em',
            fontWeight: '500'
          }
        ],
        'display-xs': [
          'clamp(1.25rem, 1.5vw + 0.25rem, 1.75rem)',
          {
            lineHeight: '1.5',
            letterSpacing: '0em',
            fontWeight: '500'
          }
        ],
        
        // Heading scale - semantic heading sizes
        'heading-1': [
          'clamp(2.5rem, 4vw + 1rem, 4.5rem)',
          {
            lineHeight: '1.1',
            letterSpacing: '-0.032em',
            fontWeight: '700'
          }
        ],
        'heading-2': [
          'clamp(2rem, 3vw + 0.75rem, 3.5rem)',
          {
            lineHeight: '1.2',
            letterSpacing: '-0.024em',
            fontWeight: '600'
          }
        ],
        'heading-3': [
          'clamp(1.75rem, 2.5vw + 0.5rem, 2.75rem)',
          {
            lineHeight: '1.3',
            letterSpacing: '-0.016em',
            fontWeight: '600'
          }
        ],
        'heading-4': [
          'clamp(1.5rem, 2vw + 0.25rem, 2.25rem)',
          {
            lineHeight: '1.4',
            letterSpacing: '-0.008em',
            fontWeight: '500'
          }
        ],
        'heading-5': [
          'clamp(1.25rem, 1.5vw + 0.125rem, 1.75rem)',
          {
            lineHeight: '1.5',
            letterSpacing: '0em',
            fontWeight: '500'
          }
        ],
        'heading-6': [
          'clamp(1.125rem, 1.25vw + 0.0625rem, 1.5rem)',
          {
            lineHeight: '1.55',
            letterSpacing: '0.004em',
            fontWeight: '500'
          }
        ],
        
        // Body text variations
        'body-2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0em' }],
        'body-xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '0.004em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.008em' }],
        'body-md': ['1rem', { lineHeight: '1.625rem', letterSpacing: '0.012em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.375rem', letterSpacing: '0.016em' }],
        'body-xs': ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.025em' }],
        
        // Caption and label text
        'caption': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.04em', fontWeight: '500' }],
        'overline': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.08em', fontWeight: '600' }],
        'label-lg': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-md': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em', fontWeight: '500' }],
        'label-sm': ['0.6875rem', { lineHeight: '0.875rem', letterSpacing: '0.03em', fontWeight: '500' }],
      },
      spacing: {
        // Extended spacing scale for typography
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
        
        // Fine-grained spacing for typography
        '0.5': '0.125rem',   // 2px
        '1.5': '0.375rem',   // 6px
        '2.5': '0.625rem',   // 10px
        '3.5': '0.875rem',   // 14px
        '4.5': '1.125rem',   // 18px
        '5.5': '1.375rem',   // 22px
        '6.5': '1.625rem',   // 26px
        '7.5': '1.875rem',   // 30px
        '8.5': '2.125rem',   // 34px
        '9.5': '2.375rem',   // 38px
        '11': '2.75rem',     // 44px
        '13': '3.25rem',     // 52px
        '15': '3.75rem',     // 60px
        '17': '4.25rem',     // 68px
        '19': '4.75rem',     // 76px
        '21': '5.25rem',     // 84px
        '22': '5.5rem',      // 88px
        '26': '6.5rem',      // 104px
        '30': '7.5rem',      // 120px
        '34': '8.5rem',      // 136px
        '38': '9.5rem',      // 152px
        '42': '10.5rem',     // 168px
        '46': '11.5rem',     // 184px
        '50': '12.5rem',     // 200px
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '104rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.5s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
      },
      // Typography-specific extensions
      lineHeight: {
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '11': '2.75rem',
        '12': '3rem',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },
      letterSpacing: {
        'tightest': '-0.08em',
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
        'mega': '0.2em',
      },
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
    },
  },
  plugins: [],
}

export default config