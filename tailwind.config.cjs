/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heading: [
          'Plus Jakarta Sans',
          'Inter',
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        murakali: {
          primary: '#2545CA',
          'primary-content': '#ffffff',
          secondary: '#3B82F6',
          'secondary-content': '#ffffff',
          accent: '#FACC15',
          'accent-focus': "#EEC10C",
          neutral: '#3D4451',
          'neutral-focus': "#303640",
          'neutral-content': "#ffffff",
          'base-100': '#ffffff',
          'base-200': '#F2F2F2',
          'base-300': '#E6E6E6',
          'base-content': '#303640',
          info: '#3b82f6',
          success: '#4ade80',
          warning: '#fde047',
          error: '#ef4444',

          '--rounded-box': '0.375rem',
          '--rounded-btn': '0.375rem',
          '--rounded-badge': '2rem',
          '--animation-btn': '0',
          '--animation-input': '0.2s',
          '--btn-text-case': '',
          '--btn-focus-scale': '1',
          '--border-btn': '1px', 
          '--tab-border': '1px', 
          '--tab-radius': '0.5rem',
        },
      },
    ],
  },
}
