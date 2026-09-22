import preset from "./tailwind-preset.js";

/**
 * Tailwind config used only while building the library stylesheet
 * (`src/styles/tailwind.css` points to it with `@config`).
 *
 * It scans the published components exclusively (never the demo or the
 * mocks) so `dist/gridory.css` contains exactly the utilities the library
 * renders. Preflight is disabled: the library ships its own reset scoped to
 * `.gdy-scope` (see `src/styles/preflight.css`) so it never restyles the
 * consumer's page.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  presets: [preset],
  content: [
    "./src/components/ai/**/*.{ts,tsx}",
    "./src/components/kanban/**/*.{ts,tsx}",
    "./src/components/table/**/*.{ts,tsx}",
    "./src/components/shared/**/*.{ts,tsx}",
    "./src/components/ui/**/*.{ts,tsx}",
    "./src/lib/**/*.ts",
  ],
  corePlugins: {
    preflight: false,
  },
};
