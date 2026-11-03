import { useMemo, useState } from "react";
import type { KanbanBoardProps } from "../types";

export const useSelectedGroup = <TData>({
  groups,
  defaultGroupId,
  onGroupChange,
}: KanbanBoardProps<TData>) => {
  const [selectedGroupId, setSelectedGroupId] = useState(defaultGroupId);
  // A `groups` swap that drops the chosen group falls back to the first one in the same render, without
  // reporting it: only the user's choice reaches onGroupChange.
  if (!groups.some((group) => group.id === selectedGroupId)) setSelectedGroupId(groups[0].id);
  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? groups[0],
    [groups, selectedGroupId],
  );
  const changeGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    onGroupChange?.(groupId);
  };
  return { selectedGroup, changeGroup };
};
