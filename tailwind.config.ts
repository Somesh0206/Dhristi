import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
export default config
