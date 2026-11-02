/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design Tokens (exact hex values)
        mirchi: {
          DEFAULT: '#C62B1F',
          hover: '#A82217',
        },
        kesar: '#F26A1B',
        haldi: '#F5B21B',
        palak: '#1E4A33',
        cream: '#FFF7EA',
        paper: '#F8EAD2',
        white: '#FFFFFF',
        espresso: '#2B1A12',
        dark: '#1F130E',
        clay: '#6B4F3F',
        wheat: '#E6D5B8',
        veg: '#1E4A33',
        nonveg: '#B3261E',

        // Compatibility aliases mapped to exact palette
        sand: '#F8EAD2',
        ink: '#2B1A12',
        chili: '#C62B1F',
        dhaniya: '#1E4A33',
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans Variable"', '"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        hindi: ['"Tiro Devanagari Hindi"', 'serif'],
      },
      fontSize: {
        // Scale: Nothing under 14px!
        'caption': ['14px', '1.5'],
        'sm': ['14px', '1.5'],
        'base': ['17px', '1.6'],
        'card-title': ['20px', '1.3'],
      },
      boxShadow: {
        // Exactly one very soft shadow
        'soft': '0 1px 2px rgba(43,26,18,0.06), 0 8px 24px rgba(43,26,18,0.06)',
        'soft-sm': '0 1px 2px rgba(43,26,18,0.05), 0 4px 12px rgba(43,26,18,0.05)',
        'soft-lg': '0 2px 4px rgba(43,26,18,0.06), 0 12px 32px rgba(43,26,18,0.08)',
      },
      borderRadius: {
        'card': '12px',
        'btn': '10px',
        'chip': '999px',
        'DEFAULT': '12px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
