import { useState } from "react";
import type { ToolbarCustomSlot } from "../../table";
import { TextSelectionClickToggle } from "./TextSelectionClickToggle";

const isEnabledInUrl = () => new URLSearchParams(window.location.search).get("seleccion-texto") === "1";

export const useTextSelectionClickToggle = () => {
  const [enabled, setEnabled] = useState(isEnabledInUrl);
  const slot: ToolbarCustomSlot = {
    id: "text-selection-click",
    content: <TextSelectionClickToggle enabled={enabled} onToggle={() => setEnabled((current) => !current)} />,
  };
  return { enabled, slot };
};
