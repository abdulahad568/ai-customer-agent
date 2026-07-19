/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#060d18",
        card: "#0d1929",
        border: "#1a2f4a",
        primary: "#00d4ff",
        "primary-dark": "#0099bb",
        muted: "#0f2035",
        "muted-fg": "#4a6a8a",
      },
    },
  },
  plugins: [],
};
