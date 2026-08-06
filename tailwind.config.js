/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Legacy aqua palette (aliased to the new blue system)
        aqua: {
          primary: "#1286D8",
          "primary-dark": "#06263D",
          secondary: "#071827",
          accent: "#20D3F2",
          bg: "#F5FBFF",
          "bg-alt": "#EAF8FF",
          surface: "#FFFFFF",
          "text-primary": "#071827",
          "text-secondary": "#45586A",
          "text-muted": "#627282",
          "border-color": "#DDECF5",
          "border-light": "#EAF4FA",
          success: "#22C55E",
          warning: "#F5A623",
          danger: "#E85454",
        },
        // Aquails blue design system (new canonical tokens)
        aq: {
          shell: "#FFFFFF",
          deep: "#06263D",
          navy: "#0A1F33",
          blue: "#1286D8",
          aqua: "#20D3F2",
          sky: "#EAF8FF",
          ice: "#F5FBFF",
          canvas: "#FFFFFF",
          text: "#071827",
          muted: "#627282",
          border: "#DDECF5",
          black: "#050B12",
        },
        // Compatibility remap: previous "forest" tokens now resolve to blue values
        // so already-restyled pages (shop, cart, admin, ...) inherit the theme.
        forest: {
          shell: "#06263D",
          dark: "#06263D",
          mid: "#0A1F33",
          soft: "#1286D8",
        },
        canvas: {
          DEFAULT: "#FFFFFF",
          muted: "#F5FBFF",
        },
        ink: {
          DEFAULT: "#071827",
          secondary: "#45586A",
          muted: "#627282",
        },
        lime: {
          DEFAULT: "#20D3F2",
          hover: "#1286D8",
          soft: "#EAF8FF",
        },
        "border-soft": "#DDECF5",
        "border-muted": "#EAF4FA",
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        poppins: ['Montserrat', 'system-ui', 'sans-serif'],
        inter: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        "2xl": "20px",
        "3xl": "24px",
        hero: "40px",
        "hero-lg": "56px",
        canvas: "40px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.03)",
        "card": "0 1px 3px rgba(7, 24, 39, 0.03)",
        "card-hover": "0 4px 14px rgba(7, 24, 39, 0.06)",
        "sm-aqua": "0 1px 2px rgba(7, 24, 39, 0.03)",
        "md-aqua": "0 2px 8px rgba(7, 24, 39, 0.04)",
        "lg-aqua": "0 4px 16px rgba(7, 24, 39, 0.05)",
        "xl-aqua": "0 8px 28px rgba(7, 24, 39, 0.07)",
        "primary": "0 2px 8px rgba(18, 134, 216, 0.12)",
        "primary-hover": "0 3px 12px rgba(18, 134, 216, 0.16)",
        "drawer": "-4px 0 16px rgba(7, 24, 39, 0.05)",
        "forest": "0 2px 12px rgba(3, 20, 33, 0.10)",
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "count-pulse": {
          "0%, 100%": { color: "#20D3F2" },
          "100%": { color: "#071827" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "marquee": "marquee 30s linear infinite",
        "shimmer": "shimmer 1.5s linear infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
