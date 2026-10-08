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
        retro: {
          bg: '#101820',
          surface: '#17232B',
          'surface-elevated': '#1D2A31',
          'surface-hover': '#24333B',
          border: 'rgba(241, 232, 211, 0.14)',
          paper: '#F1E8D3',
          'paper-dim': '#D8CCB5',
          muted: '#75848C',
          orange: '#F05A47', // Muted Coral
          coral: '#F05A47',
          amber: '#D8A94A',  // Muted Yellow / NASA Gold
          yellow: '#D8A94A',
          teal: '#79B8A5',   // Muted Analog Mint
          mint: '#79B8A5',
          red: '#D9534F',
        },
        ink: {
          DEFAULT: '#101820',
          dark: '#0B1117',
          surface: '#17232B',
          elevated: '#1D2A31',
          hover: '#24333B',
        },
        sand: {
          DEFAULT: '#F1E8D3',
          muted: '#D8CCB5',
          dim: '#75848C',
          border: 'rgba(241, 232, 211, 0.14)',
        },
        coral: {
          DEFAULT: '#F05A47',
          hover: '#D94D3B',
          glow: 'rgba(240, 90, 71, 0.25)',
        },
        mint: {
          DEFAULT: '#79B8A5',
          glow: 'rgba(121, 184, 165, 0.25)',
        },
        yellow: {
          DEFAULT: '#D8A94A',
          glow: 'rgba(216, 169, 74, 0.25)',
        },
        background: {
          DEFAULT: '#101820', // Deep ink / blue-black
          subtle: '#0D141B',
          pure: '#080D11',
        },
        surface: {
          DEFAULT: '#17232B', // Deep ink secondary surface
          elevated: '#1D2A31', // Elevated instrument panel
          hover: '#24333B',
          border: 'rgba(241, 232, 211, 0.14)', // Warm parchment line
          'border-subtle': 'rgba(241, 232, 211, 0.07)',
          'border-hover': 'rgba(240, 90, 71, 0.4)',
          'border-active': 'rgba(240, 90, 71, 0.7)',
        },
        paper: {
          DEFAULT: '#F1E8D3', // Warm Sand / Ivory paper
          dim: '#D8CCB5',
          muted: '#75848C',
        },
        accent: {
          DEFAULT: '#F05A47', // Primary Retro Coral
          coral: '#F05A47',
          orange: '#F05A47',  // Muted Coral
          amber: '#D8A94A',   // Warm Yellow / NASA Gold
          yellow: '#D8A94A',
          red: '#D9534F',     // Muted Vintage Red
          teal: '#79B8A5',    // Desaturated Analog Mint
          mint: '#79B8A5',
          ochre: '#D8A94A',
        },
        text: {
          primary: '#F1E8D3',   // Warm Sand
          secondary: '#D8CCB5', // Warm muted sand
          muted: '#75848C',     // Dim ink graphite
        },
        status: {
          success: '#79B8A5',   // Analog Mint
          warning: '#D8A94A',   // Vintage Yellow
          danger: '#D9534F',    // Muted Red
          info: '#F05A47',      // Muted Coral
        },
        category: {
          technical: '#F05A47',    // Coral
          creative: '#D8A94A',     // Yellow
          communication: '#79B8A5',// Mint
          research: '#D9534F',     // Red
          business: '#D8A94A',     // Yellow
          leadership: '#79B8A5',   // Mint
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
