import { useState } from "react";
import type { ViewMode, ViewSwitchConfig } from "../../table";

export const useViewSwitch = (initialView: ViewMode): ViewSwitchConfig => {
  const [view, setView] = useState<ViewMode>(initialView);
  return { active: view, onChange: setView };
};
