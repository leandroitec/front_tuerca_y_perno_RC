import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Formas industriales: erradica bordes redondeados suaves por defecto
    borderRadius: {
      none: "0px",
      sm: "2px",
      DEFAULT: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "9999px", // reservado para indicadores de estado puntuales
    },
    extend: {
      colors: {
        // Amarillo / Ámbar industrial pesado (Caterpillar / DeWalt)
        primary: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },
        // Gris carbón / acero maquinado oscuro
        secondary: {
          DEFAULT: "#0F172A",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        // Naranja de seguridad para maquinaria y obras civiles
        accent: {
          DEFAULT: "#EA580C",
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
          950: "#431407",
        },
        // Mapeo retrocompatible para componentes existentes con clases brand-*
        brand: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Oswald", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      // Sombras mecánicas duras (brutalismo industrial, cero blur suave)
      boxShadow: {
        hard: "4px 4px 0px 0px #0F172A",
        "hard-sm": "2px 2px 0px 0px #0F172A",
        "hard-lg": "6px 6px 0px 0px #0F172A",
        "hard-primary": "4px 4px 0px 0px #F59E0B",
      },
    },
  },
  plugins: [],
};

export default config;
