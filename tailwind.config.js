/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        priority: {
          high: '#ef4444',
          medium: '#f59e0b',
          low: '#22c55e',
        },
        text: {
          base: '#1f2937',
          muted: '#6b7280',
        },
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
