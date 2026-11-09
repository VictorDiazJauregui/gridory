import type { CSSProperties } from "react";
import type { KanbanBoardProps } from "./types";

type BoardSizeSettings = Pick<KanbanBoardProps<unknown>, "fillHeight" | "fillWidth" | "columnWidth">;

export const resolveBoardSizeClassNames = ({ fillHeight, fillWidth }: BoardSizeSettings) => [
  fillHeight && "gdy-kanban-fill",
  fillWidth && "gdy-kanban-fill-width",
];

// Written only when passed, so a board without the prop keeps the 2.0.0 markup (no style attribute).
export const resolveColumnWidthStyle = ({ columnWidth }: BoardSizeSettings): CSSProperties =>
  (columnWidth === undefined ? {} : { ["--gdy-kanban-column-width"]: `${columnWidth}px` }) as CSSProperties;
