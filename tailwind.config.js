/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#075E54',
          dark: '#05473F',
          darker: '#03322C',
          light: '#0D7E71',
          soft: '#E6F4F1',
          surface: '#F1F7F6',
        },
        emerald: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#D1FAE5',
          soft: '#ECFDF5',
        },
        sidebar: {
          bg: '#053E38',
          card: '#084B44',
          hover: '#0B5951',
          active: '#10B981',
          text: '#B7D5CF',
          textActive: '#FFFFFF',
          border: '#0A524A'
        },
        health: {
          bg: '#F1F7F6',
          card: '#FFFFFF',
          text: '#173B38',
          muted: '#718783',
          border: '#E1ECE9',
          amber: '#F59E0B',
          rose: '#EF4444',
          blue: '#3B82F6',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(7, 94, 84, 0.05)',
        'soft': '0 4px 20px -2px rgba(7, 94, 84, 0.07)',
        'soft-lg': '0 10px 25px -5px rgba(7, 94, 84, 0.1)',
        'card': '0 2px 8px rgba(23, 59, 56, 0.04), 0 1px 2px rgba(23, 59, 56, 0.03)',
        'card-hover': '0 12px 28px rgba(7, 94, 84, 0.12), 0 4px 10px rgba(7, 94, 84, 0.06)',
      }
    },
  },
  plugins: [],
}

