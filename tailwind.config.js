/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0D14',
          subtle: '#0E111B',
        },
        surface: {
          DEFAULT: '#12151F',
          elevated: '#171B28',
          hover: '#1E2335',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-subtle': 'rgba(255, 255, 255, 0.04)',
          'border-hover': 'rgba(255, 255, 255, 0.16)',
        },
        accent: {
          indigo: '#6366F1',
          violet: '#8B5CF6',
          teal: '#2DD4BF',
        },
        text: {
          primary: '#F3F4F8',
          secondary: '#A3A9BD',
          muted: '#6B7189',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        category: {
          technical: '#6366F1',
          creative: '#EC4899',
          communication: '#F59E0B',
          research: '#14B8A6',
          business: '#10B981',
          leadership: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',     // 12px for inputs & buttons
        '2xl': '1rem',       // 16px for cards
        '3xl': '1.5rem',     // 24px for modal containers
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'elevated': '0 10px 30px -4px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'glow-teal': '0 0 25px -5px rgba(45, 212, 191, 0.25)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        'gradient-accent': 'linear-gradient(135deg, #6366F1 0%, #2DD4BF 100%)',
        'gradient-subtle': 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
        'gradient-surface': 'linear-gradient(180deg, #171B28 0%, #12151F 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
