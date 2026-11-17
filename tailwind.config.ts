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
        background: "var(--background)",
        foreground: "var(--foreground)",
        royal: {
          maroon: "#800020",
          burgundy: "#5A1024",
          gold: "#C9A44C",
          goldLight: "#E8D390",
          goldDark: "#94762E",
          ivory: "#FFF9F0",
          champagne: "#F5E6C8",
          emerald: "#075E54",
          saffron: "#E68A00",
          rose: "#F8DDE2",
          dark: "#1A0F12"
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cinzel", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        devanagari: ["var(--font-devanagari)", "Rozha One", "Tiro Devanagari Hindi", "serif"],
      },
      boxShadow: {
        royal: "0 10px 30px -10px rgba(128, 0, 32, 0.2)",
        gold: "0 10px 30px -10px rgba(201, 164, 76, 0.3)",
      }
    },
  },
  plugins: [],
};
export default config;
