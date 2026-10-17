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
        background: "#ffffff",
        foreground: "#0f172a",
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
          subtle: "#f1f5f9",
        },
        border: {
          DEFAULT: "#e2e8f0",
          strong: "#cbd5e1",
        },
        primary: {
          DEFAULT: "#0f766e", // medical teal
          hover: "#115e59",
          active: "#134e4a",
          subtle: "#f0fdfa",
          border: "#99f6e4",
        },
        accent: {
          DEFAULT: "#0369a1", // restrained medical blue
          subtle: "#f0f9ff",
        },
        danger: {
          DEFAULT: "#b91c1c",
          hover: "#991b1b",
          subtle: "#fef2f2",
          border: "#fecaca",
        },
        warning: {
          DEFAULT: "#b45309",
          subtle: "#fffbeb",
          border: "#fde68a",
        },
        success: {
          DEFAULT: "#15803d",
          subtle: "#f0fdf4",
          border: "#bbf7d0",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
