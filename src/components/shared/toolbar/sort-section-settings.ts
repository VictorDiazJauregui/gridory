import type { SortDirection } from "../data-model";

export interface SortSectionSettings {
  sortable: boolean;
  sortDirection: SortDirection | null;
  onSortAsc?: () => void;
  onSortDesc?: () => void;
}
