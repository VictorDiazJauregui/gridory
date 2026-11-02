import { commands } from "vitest/browser";
import { forgetUndo, rememberUndo } from "./page-changes";

declare module "vitest/browser" {
  interface BrowserCommands {
    emulateReducedMotion: (isReduced: boolean) => Promise<void>;
  }
}

export const emulateReducedMotion = async (isReduced: boolean): Promise<void> => {
  await commands.emulateReducedMotion(isReduced);
  if (isReduced) return forgetUndo("motion");
  rememberUndo("motion", () => commands.emulateReducedMotion(true));
};
