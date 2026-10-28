export const toggleExpandedId = (expandedIds: readonly string[], id: string) =>
  expandedIds.includes(id) ? expandedIds.filter((current) => current !== id) : [...expandedIds, id];
