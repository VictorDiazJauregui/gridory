import { commands } from "vitest/browser";

type MediaType = "screen" | "print";

declare module "vitest/browser" {
  interface BrowserCommands {
    emulateMedia: (media: MediaType) => Promise<void>;
  }
}

export const emulateMediaType = (media: MediaType): Promise<void> => commands.emulateMedia(media);
