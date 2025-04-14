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
        ring: "hsl(186 86% 53%)",
        background: "hsl(230 24% 8%)",
        foreground: "hsl(0 0% 98%)",
        primary: {
          DEFAULT: "hsl(186 86% 53%)",
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
          foreground: "hsl(240 5% 75%)",
        },
        accent: {
          DEFAULT: "hsl(219 14% 22%)",
          foreground: "hsl(0 0% 98%)",
        },
        popover: {
          DEFAULT: "hsl(230 24% 8%)",
          foreground: "hsl(0 0% 98%)",
        },
        card: {
          DEFAULT: "hsl(230 24% 12%)",
          foreground: "hsl(0 0% 98%)",
        },
        sidebar: {
          DEFAULT: "hsl(230 24% 8%)",
          foreground: "hsl(240 4.8% 95.9%)",
          primary: "hsl(186 86% 53%)",
          "primary-foreground": "hsl(0 0% 100%)",
          accent: "hsl(240 3.7% 15.9%)",
          "accent-foreground": "hsl(240 4.8% 95.9%)",
          border: "hsl(240 3.7% 15.9%)",
          ring: "hsl(186 86% 53%)",
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
        "slide-down": {
          "0%": { height: "0", opacity: "0" },
          "100%": { height: "var(--radix-collapsible-content-height)", opacity: "1" }
        },
        "slide-up": {
          "0%": { height: "var(--radix-collapsible-content-height)", opacity: "1" },
          "100%": { height: "0", opacity: "0" }
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "25%": { transform: "translateY(-10px) translateX(5px)" },
          "50%": { transform: "translateY(0) translateX(10px)" },
          "75%": { transform: "translateY(10px) translateX(5px)" }
        },
        "sweep": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "pulse": {
          "0%, 100%": { opacity: "0.1" },
          "50%": { opacity: "0.3" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "shimmer": "shimmer 2s infinite linear",
        "float": "float 15s ease-in-out infinite",
        "sweep": "sweep 8s ease-in-out infinite",
        "pulse": "pulse 4s ease-in-out infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
