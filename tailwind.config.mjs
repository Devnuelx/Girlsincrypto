/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#00D8D8',
        secondary: '#B0B0B0',
        accent: '#00F0FF',
      },
      screens: {
        tablet: '640px',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        play: ['var(--font-playwrite)', 'sans-serif'],
        gara: ['var(--font-garamond)', 'serif'],
        space: ['var(--font-space-grotesk)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
