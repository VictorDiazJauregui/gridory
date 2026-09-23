import { ArrowDown, ArrowUp, ArrowUpDown, type LucideIcon } from "lucide-react";
import type { SortDirection } from "../types";

const SORT_ICON_BY_DIRECTION: Record<SortDirection | "none", LucideIcon> = {
  asc: ArrowUp,
  desc: ArrowDown,
  none: ArrowUpDown,
};

export const SortIcon = ({ direction }: { direction: SortDirection | null }) => {
  const Icon = SORT_ICON_BY_DIRECTION[direction ?? "none"];
  return <Icon size={13} className="gdy-table-head-sort-icon" />;
};
