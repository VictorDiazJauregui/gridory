import { useEffect } from "react";
import type { EditorController } from "../model/editor-controller";
import { PREVIEW_CONTENT_CHANGE_EVENT } from "../preview/preview-enhancer";
import { isScrolledToEnd, measurePreviewBlocks, scrollToEnd } from "./preview-blocks";
import { mapLineToOffset, mapOffsetToLine } from "./scroll-mapping";

type ScrollSide = "source" | "preview";

interface SyncedScrollTargets {
  controller: EditorController | null;
  previewPanel: HTMLElement | null;
  enabled: boolean;
}

const followSource = (controller: EditorController, panel: HTMLElement): void => {
  if (isScrolledToEnd(controller.scrollElement)) return scrollToEnd(panel);
  const blocks = measurePreviewBlocks(panel, panel.firstElementChild as HTMLElement);
  panel.scrollTop = mapLineToOffset(blocks, controller.readTopLine(), panel.scrollHeight);
};

const followPreview = (controller: EditorController, panel: HTMLElement): void => {
  if (isScrolledToEnd(panel)) return controller.scrollToEnd();
  const blocks = measurePreviewBlocks(panel, panel.firstElementChild as HTMLElement);
  controller.scrollToLine(mapOffsetToLine(blocks, panel.scrollTop, panel.scrollHeight));
};

const DRIVER_EVENTS = ["pointerenter", "wheel", "touchstart", "focusin", "keydown"] as const;

const listen = (element: HTMLElement, event: string, handler: () => void): (() => void) => {
  element.addEventListener(event, handler, { passive: true });
  return () => element.removeEventListener(event, handler);
};

const listenToDriver = (element: HTMLElement, takeOver: () => void): (() => void)[] =>
  DRIVER_EVENTS.map((event) => listen(element, event, takeOver));

const createFollower = (controller: EditorController, panel: HTMLElement) => {
  let frame = 0;
  const follow = (side: ScrollSide) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => (side === "source" ? followSource(controller, panel) : followPreview(controller, panel)));
  };
  return { follow, cancel: () => cancelAnimationFrame(frame) };
};

const connectSyncedScroll = (controller: EditorController, panel: HTMLElement): (() => void) => {
  const driver: { side: ScrollSide } = { side: "source" };
  const follower = createFollower(controller, panel);
  const followWhenDriving = (side: ScrollSide) => () => {
    if (driver.side === side) follower.follow(side);
  };
  const stopListening = [
    listen(controller.scrollElement, "scroll", followWhenDriving("source")),
    listen(panel, "scroll", followWhenDriving("preview")),
    listen(panel, PREVIEW_CONTENT_CHANGE_EVENT, () => follower.follow(driver.side)),
    ...listenToDriver(controller.scrollElement, () => (driver.side = "source")),
    ...listenToDriver(panel, () => (driver.side = "preview")),
  ];
  return () => {
    follower.cancel();
    stopListening.forEach((stop) => stop());
  };
};

export const useSyncedScroll = ({ controller, previewPanel, enabled }: SyncedScrollTargets): void => {
  useEffect(() => {
    if (!enabled || !controller || !previewPanel) return undefined;
    return connectSyncedScroll(controller, previewPanel);
  }, [controller, previewPanel, enabled]);
};
