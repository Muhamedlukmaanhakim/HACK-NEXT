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
        canvas: {
          DEFAULT: '#F4F1E8', // Primary off-white canvas
          pure: '#FFFFFF',
          dark: '#111111',
          muted: '#EAE6DB',
        },
        ink: {
          DEFAULT: '#111111', // Primary black
          pure: '#000000',
          secondary: '#252525',
          muted: '#555555',
          subtle: '#777777',
        },
        brutal: {
          red: '#FF4D2E',    // Brutal Red
          yellow: '#FFD43B', // Signal Yellow
          green: '#3FA66B',  // Campus Green
          black: '#111111',
          white: '#FFFFFF',
          canvas: '#F4F1E8',
          dark: '#252525',
        },
        // Semantic aliases & backward compatibility
        retro: {
          bg: '#F4F1E8',
          surface: '#FFFFFF',
          'surface-elevated': '#F4F1E8',
          'surface-hover': '#ECE8DD',
          border: '#111111',
          paper: '#111111',
          'paper-dim': '#333333',
          muted: '#555555',
          orange: '#FF4D2E',
          coral: '#FF4D2E',
          amber: '#FFD43B',
          yellow: '#FFD43B',
          teal: '#3FA66B',
          mint: '#3FA66B',
          red: '#FF4D2E',
        },
        background: {
          DEFAULT: '#F4F1E8',
          subtle: '#EAE6DB',
          pure: '#FFFFFF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F4F1E8',
          hover: '#ECE8DD',
          border: '#111111',
          'border-subtle': '#111111',
          'border-hover': '#FF4D2E',
          'border-active': '#111111',
        },
        paper: {
          DEFAULT: '#111111',
          dim: '#333333',
          muted: '#555555',
        },
        accent: {
          DEFAULT: '#FF4D2E',
          coral: '#FF4D2E',
          orange: '#FF4D2E',
          amber: '#FFD43B',
          yellow: '#FFD43B',
          red: '#FF4D2E',
          teal: '#3FA66B',
          mint: '#3FA66B',
        },
        text: {
          primary: '#111111',
          secondary: '#333333',
          muted: '#666666',
        },
        status: {
          success: '#3FA66B',
          warning: '#FFD43B',
          danger: '#FF4D2E',
          info: '#111111',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        'DEFAULT': '0px',
        'md': '2px',
        'lg': '4px',
        'xl': '4px',
        '2xl': '4px',
      },
      boxShadow: {
        'brutal': '4px 4px 0 #111111',
        'brutal-sm': '2px 2px 0 #111111',
        'brutal-lg': '6px 6px 0 #111111',
        'brutal-xl': '8px 8px 0 #111111',
        'brutal-red': '4px 4px 0 #FF4D2E',
        'brutal-yellow': '4px 4px 0 #FFD43B',
        'brutal-green': '4px 4px 0 #3FA66B',
        // Legacy compatibility
        'panel': '3px 3px 0 #111111',
        'elevated': '5px 5px 0 #111111',
        'terminal': '4px 4px 0 #FF4D2E',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
