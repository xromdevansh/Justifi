/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1F71',
        secondary: '#4B5563',
        accent: '#D4AF37',
        background: '#FAFAFA',
        text: '#111827',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        subheading: ['DM Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


