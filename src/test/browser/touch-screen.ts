import { commands } from "vitest/browser";
import { forgetUndo, rememberUndo } from "./page-changes";

declare module "vitest/browser" {
  interface BrowserCommands {
    emulateTouch: (enabled: boolean) => Promise<void>;
  }
}

/** Turns `(pointer: coarse)` on or off in the page, as on a phone. Set it before rendering. */
export const emulateTouchScreen = async (enabled: boolean): Promise<void> => {
  await commands.emulateTouch(enabled);
  if (!enabled) return forgetUndo("touch");
  rememberUndo("touch", () => commands.emulateTouch(false));
};
