import { commands } from "vitest/browser";
import { forgetUndo, rememberUndo } from "./page-changes";

type MediaType = "screen" | "print";

declare module "vitest/browser" {
  interface BrowserCommands {
    emulateMedia: (media: MediaType) => Promise<void>;
  }
}

export const emulateMediaType = async (media: MediaType): Promise<void> => {
  await commands.emulateMedia(media);
  if (media === "screen") return forgetUndo("media");
  rememberUndo("media", () => commands.emulateMedia("screen"));
};
