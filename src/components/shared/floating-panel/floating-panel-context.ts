import { createContext, useContext } from "react";

type ClosePanel = () => void;

export class MissingFloatingPanelError extends Error {
  constructor() {
    super("FloatingPanelContent must be rendered inside a FloatingPanel");
    this.name = "MissingFloatingPanelError";
  }
}

export const FloatingPanelCloseContext = createContext<ClosePanel | null>(null);

export const useCloseFloatingPanel = (): ClosePanel => {
  const closePanel = useContext(FloatingPanelCloseContext);
  if (!closePanel) throw new MissingFloatingPanelError();
  return closePanel;
};
