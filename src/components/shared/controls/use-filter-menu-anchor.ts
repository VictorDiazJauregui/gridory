import { useRef, useState } from "react";
import { useClickOutside } from "./use-click-outside";

export const useFilterMenuAnchor = () => {
  const [openFilterColumnId, setOpenFilterColumnId] = useState<string | null>(
    null,
  );
  const filterMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(filterMenuRef, () => setOpenFilterColumnId(null));
  const toggleFilterMenu = (id: string) =>
    setOpenFilterColumnId((previous) => (previous === id ? null : id));
  const closeFilterMenu = () => setOpenFilterColumnId(null);
  return { openFilterColumnId, filterMenuRef, toggleFilterMenu, closeFilterMenu };
};
