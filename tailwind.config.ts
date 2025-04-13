
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(240 3.7% 15.9%)",
        input: "hsl(240 3.7% 15.9%)",
        ring: "hsl(250 91% 67%)",
        background: "hsl(220 20% 14%)",
        foreground: "hsl(0 0% 98%)",
        primary: {
          DEFAULT: "hsl(250 91% 67%)",
          foreground: "hsl(0 0% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(219 14% 22%)",
          foreground: "hsl(0 0% 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0 62.8% 30.6%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(219 14% 22%)",
          foreground: "hsl(240 5% 64.9%)",
        },
        accent: {
          DEFAULT: "hsl(219 14% 22%)",
          foreground: "hsl(0 0% 98%)",
        },
        popover: {
          DEFAULT: "hsl(220 20% 14%)",
          foreground: "hsl(0 0% 98%)",
        },
        card: {
          DEFAULT: "hsl(220 20% 18%)",
          foreground: "hsl(0 0% 98%)",
        },
        sidebar: {
          DEFAULT: "hsl(220 20% 14%)",
          foreground: "hsl(240 4.8% 95.9%)",
          primary: "hsl(250 91% 67%)",
          "primary-foreground": "hsl(0 0% 100%)",
          accent: "hsl(240 3.7% 15.9%)",
          "accent-foreground": "hsl(240 4.8% 95.9%)",
          border: "hsl(240 3.7% 15.9%)",
          ring: "hsl(217.2 91.2% 59.8%)",
        },
        asset: {
          bank: "hsl(199 89% 57%)",
          stocks: "hsl(142 76% 66%)",
          crypto: "hsl(269 91% 79%)",
          investment: "hsl(43 96% 69%)",
          realestate: "hsl(28 96% 61%)",
        },
        liability: {
          mortgage: "hsl(0 91% 71%)",
          creditcard: "hsl(330 84% 71%)",
          loan: "hsl(262 83% 72%)",
          other: "hsl(214 95% 70%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
