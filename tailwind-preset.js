/**
 * Gridory Tailwind preset.
 *
 * Maps the shadcn-style design tokens (CSS custom properties) to Tailwind
 * theme keys. The library's own stylesheet ships default values for every
 * token under `:where(:root)` / `:where(.dark)`, so a consumer only needs
 * this preset when it wants to reuse the same token names in its own UI.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [],
  theme: {
    extend: {
      borderColor: {
        border: "var(--border)",
      },
      outlineColor: {
        ring: "var(--ring)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
};
