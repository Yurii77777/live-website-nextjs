import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      fontSize: {
        // Display sizes (for hero sections, main headings)
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }], // 72px
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }], // 60px
        "display-lg": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }], // 48px
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }], // 36px
        "display-sm": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }], // 30px

        // Text sizes (for body text, UI elements)
        xl: ["1.25rem", { lineHeight: "1.5" }], // 20px
        lg: ["1.125rem", { lineHeight: "1.5" }], // 18px
        base: ["1rem", { lineHeight: "1.5" }], // 16px
        sm: ["0.875rem", { lineHeight: "1.5" }], // 14px
        xs: ["0.75rem", { lineHeight: "1.5" }], // 12px
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
        glass: "20px",
      },
      colors: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(0 0% 3.9%)",
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(0 0% 3.9%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(0 0% 3.9%)",
        },
        primary: {
          DEFAULT: "hsl(0 0% 9%)",
          foreground: "hsl(0 0% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(0 0% 96.1%)",
          foreground: "hsl(0 0% 9%)",
        },
        muted: {
          DEFAULT: "hsl(0 0% 96.1%)",
          foreground: "hsl(0 0% 45.1%)",
        },
        accent: {
          DEFAULT: "hsl(0 0% 96.1%)",
          foreground: "hsl(0 0% 9%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(0 0% 98%)",
        },
        border: "hsl(0 0% 89.8%)",
        input: "hsl(0 0% 89.8%)",
        ring: "hsl(0 0% 3.9%)",
        chart: {
          "1": "hsl(12 76% 61%)",
          "2": "hsl(173 58% 39%)",
          "3": "hsl(197 37% 24%)",
          "4": "hsl(43 74% 66%)",
          "5": "hsl(27 87% 67%)",
        },
        // Brand colors
        brand: {
          blue: {
            400: "#60a5fa", // Used in text gradients
            500: "#3b82f6", // Used in background gradients
          },
          purple: {
            400: "#c084fc", // Used in text gradients
            500: "#a855f7", // Used in background gradients
          },
          pink: {
            400: "#f472b6", // Used in text gradients
            500: "#ec4899", // Used in background gradients
          },
        },
        // Header theme
        header: {
          bg: "#111827", // Main header background color (gray-900)
        },
      },
      backdropBlur: {
        glass: "8px",
        "glass-light": "1px",
      },
      boxShadow: {
        glass: "0 6px 24px rgba(0, 0, 0, 0.2)",
        "glass-inset": "inset 0 0 20px -5px rgba(255, 255, 255, 0.6)",
      },
      transitionTimingFunction: {
        glass: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      backgroundImage: {
        // Brand gradients
        "brand-gradient": "linear-gradient(to right, var(--tw-gradient-stops))",
        "brand-gradient-overlay":
          "linear-gradient(to right, #3b82f6, #a855f7, #ec4899)",
        "brand-gradient-text":
          "linear-gradient(to right, #60a5fa, #c084fc, #f472b6)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
