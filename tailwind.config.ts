import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, trustworthy, local palette.
        brand: {
          50: "#fdf6ee",
          100: "#f8e7d3",
          200: "#f0cca5",
          300: "#e6ab70",
          400: "#dd8b45",
          500: "#d2722c",
          600: "#bb5a22",
          700: "#9b431f",
          800: "#7d3720",
          900: "#662f1d",
        },
        sage: {
          50: "#f3f6f3",
          100: "#e2ebe2",
          200: "#c6d8c7",
          300: "#9fbca1",
          400: "#739a76",
          500: "#537d57",
          600: "#3f6343",
          700: "#344f37",
          800: "#2c402f",
          900: "#263528",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(123, 55, 32, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
