import { commands } from "vitest/browser";

declare module "vitest/browser" {
  interface BrowserCommands {
    emulateTouch: (enabled: boolean) => Promise<void>;
  }
}

/** Turns `(pointer: coarse)` on or off in the page, as on a phone. Set it before rendering. */
export const emulateTouchScreen = (enabled: boolean): Promise<void> => commands.emulateTouch(enabled);
