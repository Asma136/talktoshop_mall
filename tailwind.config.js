/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8eef5',
          100: '#d1dcea',
          200: '#a3b9d5',
          300: '#7596c0',
          400: '#4773ab',
          500: '#1B3A5F',
          600: '#162e4c',
          700: '#102339',
          800: '#0b1726',
          900: '#050c13',
        },
        secondary: {
          50: '#fce7f3',
          100: '#f9cfe7',
          200: '#f39fcf',
          300: '#ed6fb7',
          400: '#e73f9f',
          500: '#D91C81',
          600: '#ae1667',
          700: '#82114d',
          800: '#570b34',
          900: '#2b061a',
        },
      },
    },
  },
  plugins: [],
};
