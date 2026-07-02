/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pine: {
          50: "#EAF3EE",
          100: "#CFE6D8",
          300: "#7FB99A",
          500: "#2F7A54",
          600: "#1B5E42",
          700: "#154A34",
          900: "#0B3D2E",
        },
        mango: {
          400: "#FFB238",
          500: "#F4A300",
          600: "#D98A00",
        },
        plum: {
          400: "#9C6DB5",
          500: "#7B4B94",
          600: "#623A78",
        },
        mint: {
          50: "#F5FAF6",
          100: "#F3F8F4",
        },
        ink: {
          900: "#142019",
          700: "#2B3A32",
          500: "#5A6B61",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(11, 61, 46, 0.12)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "grad-citrus": "linear-gradient(135deg, #F4A300 0%, #FF6B4A 100%)",
        "grad-forest": "linear-gradient(135deg, #1B5E42 0%, #0B3D2E 100%)",
        "grad-plum": "linear-gradient(135deg, #7B4B94 0%, #4A2E5C 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        shimmer: "shimmer 1.8s infinite linear",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
    },
  },
  plugins: [],
};
