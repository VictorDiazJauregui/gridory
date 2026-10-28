import { commands } from "vitest/browser";

declare module "vitest/browser" {
  interface BrowserCommands {
    emulateReducedMotion: (isReduced: boolean) => Promise<void>;
  }
}

export const emulateReducedMotion = (isReduced: boolean): Promise<void> => commands.emulateReducedMotion(isReduced);
