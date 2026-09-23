/**
 * Gridory Tailwind preset.
 *
 * Maps the library's design tokens (`--gdy-*` CSS custom properties, shipped
 * with defaults for light and dark mode in `gridory/styles.css`) to the usual
 * shadcn-style Tailwind theme keys (`bg-background`, `text-primary`, …). A
 * consumer only needs this preset when it wants those utilities in its own
 * UI (for example inside a custom `renderCard`) using the same colors the
 * library renders with.
 *
 * @type {import('tailwindcss').Config}
 */

/**
 * Builds a Tailwind color from a `--gdy-*` token. Plain utilities
 * (`bg-primary`) emit the variable as-is; opacity modifiers (`bg-primary/10`,
 * `ring-ring/50`) blend the token with `color-mix`, because a variable that
 * holds a full color cannot take Tailwind's `<alpha-value>` slot. Without
 * this, Tailwind 3 silently drops the modifier and falls back to its default
 * (blue) ring color.
 *
 * @param {string} name token name without the `--gdy-` prefix
 */
const token = (name) => ({ opacityValue }) => {
  const variable = `var(--gdy-${name})`;
  if (opacityValue === undefined || String(opacityValue).startsWith("var(")) {
    return variable;
  }
  return `color-mix(in oklab, ${variable} calc(${opacityValue} * 100%), transparent)`;
};

export default {
  content: [],
  theme: {
    extend: {
      borderColor: {
        border: token("border"),
      },
      outlineColor: {
        ring: token("ring"),
      },
      colors: {
        background: token("background"),
        foreground: token("foreground"),
        card: {
          DEFAULT: token("card"),
          foreground: token("card-foreground"),
        },
        popover: {
          DEFAULT: token("popover"),
          foreground: token("popover-foreground"),
        },
        primary: {
          DEFAULT: token("primary"),
          foreground: token("primary-foreground"),
        },
        secondary: {
          DEFAULT: token("secondary"),
          foreground: token("secondary-foreground"),
        },
        muted: {
          DEFAULT: token("muted"),
          foreground: token("muted-foreground"),
        },
        accent: {
          DEFAULT: token("accent"),
          foreground: token("accent-foreground"),
        },
        destructive: {
          DEFAULT: token("destructive"),
          foreground: token("destructive-foreground"),
        },
        border: token("border"),
        input: token("input"),
        ring: token("ring"),
      },
      borderRadius: {
        lg: "var(--gdy-radius)",
        md: "calc(var(--gdy-radius) - 2px)",
        sm: "calc(var(--gdy-radius) - 4px)",
      },
    },
  },
};
