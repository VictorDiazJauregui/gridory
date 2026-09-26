import type { MouseEvent } from "react";

/**
 * Pressing a button blurs the focused field, and a blur can reveal an error
 * that pushes the button down before the mouse is released, so the click
 * lands elsewhere. Keeping the focus where it is avoids that jump; keyboard
 * users are unaffected because they never press with a mouse.
 */
export const keepFieldFocus = (event: MouseEvent<HTMLElement>) => event.preventDefault();
