import { useEffect, useMemo, useState } from "react";
import type { KanbanBoardProps } from "../types";

export const useSelectedGroup = <TData>({
  groups,
  defaultGroupId,
  onGroupChange,
}: KanbanBoardProps<TData>) => {
  const [selectedGroupId, setSelectedGroupId] = useState(defaultGroupId);
  useEffect(() => {
    if (groups.some((group) => group.id === selectedGroupId)) return;
    // The selection must survive a `groups` swap: resetting it here keeps the
    // effect order and timing of the original board.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedGroupId(groups[0].id);
  }, [groups, selectedGroupId]);
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
