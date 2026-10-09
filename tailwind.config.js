/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F4F0E6', // Warm off-white paper canvas
          pure: '#FFFFFF',
          dark: '#111111',
          muted: '#EAE6DB',
          card: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#111111', // Primary black
          pure: '#000000',
          secondary: '#222222',
          muted: '#555555',
          subtle: '#777777',
        },
        brutal: {
          red: '#D93620',    // Target Red
          yellow: '#F1C83B', // Target Yellow
          green: '#687A55',  // Muted Green
          black: '#111111',
          white: '#FFFFFF',
          canvas: '#F4F0E6',
          dark: '#1A1A1A',
        },
        // Semantic aliases & backward compatibility
        retro: {
          bg: '#F4F0E6',
          surface: '#FFFFFF',
          'surface-elevated': '#F4F0E6',
          'surface-hover': '#EDE9DF',
          border: '#111111',
          paper: '#111111',
          'paper-dim': '#2B2B2B',
          muted: '#555555',
          orange: '#D93620',
          coral: '#D93620',
          amber: '#F1C83B',
          yellow: '#F1C83B',
          teal: '#687A55',
          mint: '#687A55',
          red: '#D93620',
        },
        background: {
          DEFAULT: '#F4F0E6',
          subtle: '#EDE9DF',
          pure: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F4F0E6',
          hover: '#EDE9DF',
          border: '#111111',
          'border-subtle': '#111111',
          'border-hover': '#D93620',
          'border-active': '#111111',
        },
        paper: {
          DEFAULT: '#111111',
          dim: '#2B2B2B',
          muted: '#555555',
        },
        accent: {
          DEFAULT: '#D93620',
          coral: '#D93620',
          orange: '#D93620',
          amber: '#F1C83B',
          yellow: '#F1C83B',
          red: '#D93620',
          teal: '#687A55',
          mint: '#687A55',
        },
        text: {
          primary: '#111111',
          secondary: '#2B2B2B',
          muted: '#666666',
        },
        status: {
          success: '#687A55',
          warning: '#F1C83B',
          danger: '#D93620',
          info: '#111111',
        },
        'signal-yellow': '#F1C83B',
        'campus-green': '#687A55',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '0px',
        'DEFAULT': '0px',
        'md': '2px',
        'lg': '2px',
        'xl': '2px',
        '2xl': '4px',
      },
      boxShadow: {
        'brutal': '3px 3px 0 #111111',
        'brutal-sm': '2px 2px 0 #111111',
        'brutal-lg': '4px 4px 0 #111111',
        'brutal-xl': '6px 6px 0 #111111',
        'brutal-red': '3px 3px 0 #D93620',
        'brutal-yellow': '3px 3px 0 #F1C83B',
        'brutal-green': '3px 3px 0 #687A55',
        // Legacy compatibility
        'panel': '3px 3px 0 #111111',
        'elevated': '4px 4px 0 #111111',
        'terminal': '3px 3px 0 #D93620',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
