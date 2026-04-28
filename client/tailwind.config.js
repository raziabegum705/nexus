/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Times New Roman', 'serif'],
        sans: ['Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        base: '18px',
        sm: '16px',
        lg: '20px',
        xl: '24px',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
    styled: true,
    base: true,
    utils: true,
    logs: false,
  },
}
