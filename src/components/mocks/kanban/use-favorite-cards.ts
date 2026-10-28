import { useState } from "react";
import type { MockCompanyRow } from "../company/company-rows";

const toggleId = (ids: ReadonlySet<string>, id: string) => {
  const next = new Set(ids);
  if (!next.delete(id)) next.add(id);
  return next;
};

export const useFavoriteCards = () => {
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(() => new Set());
  const toggleFavorite = (row: MockCompanyRow) => setFavoriteIds((ids) => toggleId(ids, row.id));
  return { favoriteIds, toggleFavorite };
};
