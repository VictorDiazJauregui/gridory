import type { Config } from "tailwindcss";

/** Thrown by `createGridoryPreset` when the prefix is empty or not lowercase kebab-case. */
export declare class InvalidPresetPrefixError extends Error {
  constructor(prefix: unknown);
}

export interface GridoryPresetOptions {
  /** Prefix of every utility: `bg-<prefix>-primary`, `rounded-<prefix>-lg`. Defaults to `"gdy"`. */
  prefix?: string;
}

/**
 * Preset whose utilities live under `prefix` (`bg-gdy-primary`, `rounded-gdy-lg`), so no color or
 * radius of your project changes.
 *
 * @throws {InvalidPresetPrefixError} when the prefix is empty or not lowercase kebab-case
 */
export declare const createGridoryPreset: (options?: GridoryPresetOptions) => Config;

/**
 * The shadcn-style preset (`bg-primary`, `rounded-lg`).
 *
 * @deprecated Use `createGridoryPreset()` (prefixed utilities). This preset is removed in 2.0.0.
 */
declare const gridoryPreset: Config;
export default gridoryPreset;
