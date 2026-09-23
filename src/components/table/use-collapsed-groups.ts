import { useState } from "react";
import { toggleSetMember } from "./row-grouping";

export const useCollapsedGroups = () => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => new Set(),
  );
  const toggleGroup = (value: string) =>
    setCollapsedGroups((previous) => toggleSetMember(previous, value));
  return { collapsedGroups, setCollapsedGroups, toggleGroup };
};
