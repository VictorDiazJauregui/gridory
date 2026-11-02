import { useState, type KeyboardEvent } from "react";
import type { ResizeControl, ResizeSession } from "./resize-control";

const KEYBOARD_STEP_IN_PX = 10;
const ARROW_STEPS: Readonly<Record<string, number>> = { ArrowLeft: -KEYBOARD_STEP_IN_PX, ArrowRight: KEYBOARD_STEP_IN_PX };

interface KeyboardSession extends ResizeSession {
  width: number;
}

// Holding an arrow repeats keydown: every repeat moves the same session, and only the keyup commits it.
const createKeyboardTracker = () => {
  let session: KeyboardSession | null = null;
  return {
    move: (control: ResizeControl, step: number) => {
      const current = session ?? { ...control.begin(), width: Number.NaN };
      const start = Number.isNaN(current.width) ? current.startWidth : current.width;
      current.width = control.preview(current, start + step * current.direction, "keyboard");
      session = current;
    },
    finish: (control: ResizeControl) => {
      const current = session;
      session = null;
      if (current) control.finish(current, current.width);
    },
    drop: () => {
      session = null;
    },
  };
};

type KeyboardTracker = ReturnType<typeof createKeyboardTracker>;

const handleKeyDown = (tracker: KeyboardTracker, control: ResizeControl, event: KeyboardEvent<HTMLDivElement>) => {
  if (event.key === "Enter") {
    event.preventDefault();
    tracker.drop();
    control.reset();
    return;
  }
  const step = ARROW_STEPS[event.key];
  if (step === undefined) return;
  event.preventDefault();
  tracker.move(control, step);
};

export const useResizeKeyboard = (control: ResizeControl) => {
  const [tracker] = useState(createKeyboardTracker);
  return {
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => handleKeyDown(tracker, control, event),
    onKeyUp: (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key in ARROW_STEPS) tracker.finish(control);
    },
    onBlur: () => tracker.finish(control),
  };
};
