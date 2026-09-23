import preset from "./tailwind-preset.js";

/**
 * Tailwind config used only while building the library stylesheet
 * (`src/styles/tailwind.css` points to it with `@config`).
 *
 * Every module (primitives, table, kanban, shared layer and assistant) ships
 * its own gdy-* stylesheet, so no component renders a utility class any more
 * and the layer only contributes Tailwind's base variables (plus the few rules
 * whose names collide with plain words in the sources, such as `table` or
 * `filter`) until it leaves the build with the rest of the tooling. The scan
 * still covers the assistant (never the demo or the mocks).
 * Preflight is disabled: the library ships its own reset scoped to
 * `.gdy-scope` (see `src/styles/preflight.css`) so it never restyles the
 * consumer's page.
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
