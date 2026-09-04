import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-urbanist)", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#003B8E",
          blue: "#003B8E",
          "blue-light": "#0057D2",
          "blue-dark": "#002C6A",
          light: "#0057D2",
          dark: "#002C6A",
          gold: "#F2A600",
          "gold-light": "#FFC547",
          "gold-dark": "#C87B00",
          green: "#82C000",
          "green-light": "#9DE900",
          "green-dark": "#4BA600",
        },
        neutral: {
          950: "#0C0C0C",
          50: "#FAFAFA",
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      transitionDuration: {
        150: "150ms",
        200: "200ms",
        300: "300ms",
        600: "600ms",
        800: "800ms",
      },
    },
  },
  plugins: [],
};

export default config;
