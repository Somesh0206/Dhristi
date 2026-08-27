/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx,mdx}',
    './src/components/**/*.{js,jsx,mdx}',
    './src/app/**/*.{js,jsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hazard: {
          red: '#EF4444',
          'red-dark': '#991B1B',
          orange: '#F97316',
          yellow: '#EAB308',
          green: '#10B981',
          'green-dark': '#065F46',
          blue: '#0EA5E9',
        },
        slate: {
          850: '#151f32',
          900: '#0F172A',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar-spin': 'spin 4s linear infinite',
      }
    },
  },
  plugins: [],
}

module.exports = config
