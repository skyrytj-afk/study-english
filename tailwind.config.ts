import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcd9ff",
          300: "#8ec0ff",
          400: "#599dff",
          500: "#3479f6",
          600: "#1f5be0",
          700: "#1a49b8",
          800: "#1b3f93",
          900: "#1c3974",
        },
      },
    },
  },
  plugins: [],
};

export default config;
