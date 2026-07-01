/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { DEFAULT: '#4f46e5', dark: '#4338ca' },
        base: '#0f1117',
        panel: '#171a23',
        panel2: '#1f2330',
        line: '#2a2f3d',
      },
    },
  },
  plugins: [],
};
