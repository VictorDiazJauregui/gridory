import preset from "./tailwind-preset.js";

/**
 * Tailwind config used only while building the library stylesheet
 * (`src/styles/tailwind.css` points to it with `@config`).
 *
 * It scans the assistant exclusively (never the demo or the mocks): since the
 * primitives, the table, the kanban and the shared layer ship their own
 * gdy-* stylesheets, `dist/gridory.css` contains exactly the utilities the
 * assistant still renders. Preflight is disabled: the library ships its own
 * reset scoped to `.gdy-scope` (see `src/styles/preflight.css`) so it never
 * restyles the consumer's page.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  presets: [preset],
  content: ["./src/components/ai/**/*.{ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
};
