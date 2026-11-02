import { useState, type PointerEvent } from "react";
import { clampWidth } from "../columns/column-widths";
import type { ResizeControl, ResizeSession } from "./resize-control";

interface DragSession extends ResizeSession {
  startX: number;
  /** Where the pointer last put the edge; a release before the next frame still commits it. */
  targetWidth: number;
}

const widthAt = (session: DragSession, clientX: number) =>
  session.startWidth + (clientX - session.startX) * session.direction;

// Lives across renders (one per handle) and only outside them: the handlers read and write it.
interface DragTracker {
  session: DragSession | null;
  frame: number;
}

const createDragTracker = (): DragTracker => ({ session: null, frame: 0 });

const startDrag = (tracker: DragTracker, control: ResizeControl, clientX: number) => {
  const started = control.begin();
  tracker.session = { ...started, startX: clientX, targetWidth: started.startWidth };
};

const updateDragTarget = (tracker: DragTracker, clientX: number) => {
  const session = tracker.session;
  if (session) session.targetWidth = clampWidth(widthAt(session, clientX), session.limits);
};

const moveDrag = (tracker: DragTracker, control: ResizeControl, clientX: number) => {
  updateDragTarget(tracker, clientX);
  const session = tracker.session;
  if (!session) return;
  cancelAnimationFrame(tracker.frame);
  tracker.frame = requestAnimationFrame(() => control.preview(session, session.targetWidth, "pointer"));
};

const finishDrag = (tracker: DragTracker, control: ResizeControl) => {
  const session = tracker.session;
  tracker.session = null;
  cancelAnimationFrame(tracker.frame);
  if (session) control.finish(session, session.targetWidth);
};

export const useResizeDrag = (control: ResizeControl) => {
  const [tracker] = useState(createDragTracker);
  const finish = () => finishDrag(tracker, control);
  return {
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      // No text selection and no focus jump while the pointer drags the edge.
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      startDrag(tracker, control, event.clientX);
    },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => moveDrag(tracker, control, event.clientX),
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => {
      updateDragTarget(tracker, event.clientX);
      finish();
    },
    onPointerCancel: finish,
    onLostPointerCapture: finish,
  };
};
