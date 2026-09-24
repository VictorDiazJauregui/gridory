import { useState } from "react";
import type { ArchivedViewConfig, ArchivedViewMode } from "../data-model";

export const useArchivedMode = (archivedView?: ArchivedViewConfig) => {
  const [internalMode, setInternalMode] = useState<ArchivedViewMode>(
    archivedView?.defaultValue ?? "active",
  );
  const archivedMode = archivedView?.value ?? internalMode;
  const changeArchivedMode = (next: ArchivedViewMode) => {
    if (archivedView?.value === undefined) setInternalMode(next);
    archivedView?.onChange?.(next);
  };
  return { archivedMode, changeArchivedMode };
};
