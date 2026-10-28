import { useState } from "react";
import type { KanbanMoveMenuMode } from "../../kanban";
import type { HeaderSelectConfig } from "../../table";

const MOVE_MENU_OPTIONS = [
  { value: "auto", label: "Automático" },
  { value: "always", label: "Siempre" },
  { value: "never", label: "Nunca" },
];

const isMoveMenuMode = (value: string): value is KanbanMoveMenuMode =>
  MOVE_MENU_OPTIONS.some((option) => option.value === value);

// "Automático" only shows "Mover a…" on a touch screen; "Siempre" lets a desktop try it with the mouse.
export const useMoveMenuSelector = () => {
  const [mode, setMode] = useState<KanbanMoveMenuMode>("auto");
  const selector: HeaderSelectConfig = {
    id: "moveMenu",
    label: "Mover a…",
    value: mode,
    onChange: (value) => {
      if (isMoveMenuMode(value)) setMode(value);
    },
    options: MOVE_MENU_OPTIONS,
  };
  // The board props of the demo: the selector joins the other header selectors.
  const withSelector = (headerSelectors: HeaderSelectConfig[]) => ({
    headerSelectors: [...headerSelectors, selector],
    moveMenu: mode,
  });
  return { withSelector };
};
