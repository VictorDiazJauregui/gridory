import { commands } from "vitest/browser";

interface PointerScroll {
  selector: string;
  deltaY: number;
}

declare module "vitest/browser" {
  interface BrowserCommands {
    wheelPointer: (scroll: PointerScroll) => Promise<void>;
    swipeTouch: (scroll: PointerScroll) => Promise<void>;
  }
}

/** Turns a real mouse wheel over the first element that matches the selector. */
export const wheelPointer = (scroll: PointerScroll): Promise<void> => commands.wheelPointer(scroll);

/** Drags a finger upwards by `deltaY` from the center of the element; needs `emulateTouchScreen(true)`. */
export const swipeTouch = (scroll: PointerScroll): Promise<void> => commands.swipeTouch(scroll);
