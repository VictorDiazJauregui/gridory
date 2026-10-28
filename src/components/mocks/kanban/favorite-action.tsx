import { Star, StarOff } from "lucide-react";
import type { RowAction } from "../../shared/menu/row-action";
import type { MockCompanyRow } from "../company/company-rows";

/** One action whose text and icon follow the card, instead of two with opposite `hidden`. */
export const buildFavoriteAction = (
  favoriteIds: ReadonlySet<string>,
  toggleFavorite: (row: MockCompanyRow) => void,
): RowAction<MockCompanyRow> => ({
  id: "favorite",
  label: (row) => (favoriteIds.has(row.id) ? "Quitar favorito" : "Marcar favorito"),
  icon: (row) => (favoriteIds.has(row.id) ? <StarOff size={16} /> : <Star size={16} />),
  placement: "top",
  onClick: toggleFavorite,
});
