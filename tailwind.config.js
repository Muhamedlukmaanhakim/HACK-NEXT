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
          DEFAULT: '#11100E', // Deep charcoal / warm black
          subtle: '#161411',
          pure: '#0C0B0A',
        },
        surface: {
          DEFAULT: '#1B1915', // Dark graphite / warm dark surface
          elevated: '#24211C', // Elevated instrument panel
          hover: '#2D2923',
          border: 'rgba(233, 223, 201, 0.12)', // Subtle warm paper line
          'border-subtle': 'rgba(233, 223, 201, 0.06)',
          'border-hover': 'rgba(242, 106, 46, 0.35)',
          'border-active': 'rgba(242, 106, 46, 0.65)',
        },
        paper: {
          DEFAULT: '#E9DFC9', // Warm Ivory / Cream paper
          dim: '#CFC3AA',
          muted: '#8A8270',
        },
        accent: {
          DEFAULT: '#F26A2E', // Primary Retro Orange
          orange: '#F26A2E',  // Burnt/Retro Orange
          amber: '#F5B544',   // Warm Amber / NASA Gold
          red: '#B94A3A',     // Muted Vintage Red
          teal: '#4D8B83',    // Desaturated Analog Teal
          ochre: '#D97736',
        },
        text: {
          primary: '#E9DFC9',   // Warm ivory
          secondary: '#A8A08E', // Warm muted grey
          muted: '#706B5E',     // Dim warm graphite
        },
        status: {
          success: '#4D8B83',   // Analog Teal Green
          warning: '#F5B544',   // Vintage Amber
          danger: '#B94A3A',    // Muted Red
          info: '#F26A2E',      // Retro Orange
        },
        category: {
          technical: '#F26A2E',    // Orange
          creative: '#F5B544',     // Amber
          communication: '#4D8B83',// Teal
          research: '#B94A3A',     // Red
          business: '#D97736',     // Ochre
          leadership: '#B57048',   // Terracotta
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '10px',
        '2xl': '12px',
      },
      boxShadow: {
        'panel': '0 4px 20px -2px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(233, 223, 201, 0.05)',
        'elevated': '0 10px 30px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(233, 223, 201, 0.08)',
        'terminal': '0 0 15px rgba(242, 106, 46, 0.15)',
        'amber-glow': '0 0 15px rgba(245, 181, 68, 0.18)',
        'teal-glow': '0 0 15px rgba(77, 139, 131, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'blink': 'blink 1.2s ease-in-out infinite',
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
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        }
      }
    },
  },
  plugins: [],
}
