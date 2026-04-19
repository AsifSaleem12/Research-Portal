import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16212f',
        mist: '#f5f7fb',
        sand: '#f3eee6',
        line: '#d7dfeb',
        accent: '#0d6b66',
        accentSoft: '#d9f0ee',
        copper: '#b7713b',
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
      },
      boxShadow: {
        card: '0 18px 40px rgba(15, 35, 65, 0.08)',
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, rgba(22, 33, 47, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(22, 33, 47, 0.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
