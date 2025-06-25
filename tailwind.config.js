/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  safelist: [
    // Background colors for badges/avatars
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-lime-500',
    'bg-emerald-500',

    // Background colors for todo items
    'bg-red-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-indigo-100',
    'bg-orange-100',
    'bg-teal-100',
    'bg-cyan-100',
    'bg-lime-100',
    'bg-emerald-100',

    // Text colors for todo items
    'text-red-800',
    'text-blue-800',
    'text-green-800',
    'text-yellow-800',
    'text-purple-800',
    'text-pink-800',
    'text-indigo-800',
    'text-orange-800',
    'text-teal-800',
    'text-cyan-800',
    'text-lime-800',
    'text-emerald-800',

    // Pattern-based safelist (more efficient if your Tailwind version supports it)
    {
      pattern:
        /bg-(red|blue|green|yellow|purple|pink|indigo|orange|teal|cyan|lime|emerald)-(100|500)/,
    },
    {
      pattern:
        /text-(red|blue|green|yellow|purple|pink|indigo|orange|teal|cyan|lime|emerald)-800/,
    },
  ],
  theme: {
    extend: {
      // You can extend the theme here if needed
    },
  },
  plugins: [],
};
