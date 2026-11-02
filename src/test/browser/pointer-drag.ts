import { commands } from "vitest/browser";

interface PointerDrag {
  selector: string;
  deltaX: number;
  steps: number;
}

declare module "vitest/browser" {
  interface BrowserCommands {
    dragPointer: (drag: PointerDrag) => Promise<void>;
  }
}

export const dragPointer = (drag: PointerDrag): Promise<void> => commands.dragPointer(drag);
