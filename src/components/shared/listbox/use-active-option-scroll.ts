import { useEffect, useRef } from "react";

export const useActiveOptionScroll = (
  activeOptionId: string | undefined,
  scrollsToActiveOption: boolean,
) => {
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!activeOptionId || !scrollsToActiveOption) return;
    const activeRow = listRef.current?.querySelector<HTMLElement>("[data-active]");
    activeRow?.scrollIntoView({ block: "nearest" });
  }, [activeOptionId, scrollsToActiveOption]);
  return listRef;
};
