import type { MouseEvent } from "react";

// A blur can reveal an error that pushes the button down mid-click, so the click lands elsewhere.
// Keyboard users never press with a mouse, so they are unaffected.
export const keepFieldFocus = (event: MouseEvent<HTMLElement>) => event.preventDefault();
