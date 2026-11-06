/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // Material ships its own base styles; Tailwind's preflight would override them.
    preflight: false,
  },
}

