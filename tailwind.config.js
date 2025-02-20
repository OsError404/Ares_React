import { fontFamily } from 'tailwindcss/defaultTheme';

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
          DEFAULT: '#2C5282', // Azul petróleo
          50: '#EDF2F7',
          100: '#E2E8F0',
          200: '#BEE3F8',
          300: '#90CDF4',
          400: '#63B3ED',
          500: '#4299E1',
          600: '#2C5282', // Base color
          700: '#2A4365',
          800: '#1A365D',
          900: '#1A365D',
        },
        secondary: {
          DEFAULT: '#718096',
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
        },
        sage: {
          DEFAULT: '#68A678',
          50: '#F0F4F1',
          100: '#E2EBE4',
          200: '#C5D8C9',
          300: '#A8C5AE',
          400: '#8BB293',
          500: '#68A678',
          600: '#4F8B5F',
          700: '#3D6B49',
          800: '#2B4B33',
          900: '#192B1E',
        },
        burgundy: {
          DEFAULT: '#8B2635',
          50: '#FCE8EA',
          100: '#F9D1D5',
          200: '#F3A3AB',
          300: '#ED7581',
          400: '#E74757',
          500: '#8B2635', // Base color
          600: '#701D2A',
          700: '#55161F',
          800: '#3A0E14',
          900: '#1F0709',
        },
        background: {
          DEFAULT: '#F8F7F4', // Beige suave
          paper: '#FFFFFF',
          subtle: '#F5F3EF', // Marfil suave
        },
        success: {
          DEFAULT: '#68A678', // Verde sage
        },
        error: {
          DEFAULT: '#8B2635', // Borgoña
        },
        warning: {
          DEFAULT: '#C4704F', // Terracota
        },
      },
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
        display: ['Inter var', ...fontFamily.sans],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}