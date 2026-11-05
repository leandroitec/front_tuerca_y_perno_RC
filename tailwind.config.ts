import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff8ed",
          100: "#ffeed4",
          200: "#fed7aa",
          300: "#fdb774",
          400: "#fb8c3c",
          500: "#f97316", // Ferretería Orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        slate: {
          850: "#152033",
          950: "#0b1120",
        },
      },
    },
  },
  plugins: [],
};

export default config;
