import { normalizeToArray } from "../shared/row-pipeline";
import type { FilterOption, KanbanGroupOption } from "./types";

export const getGroupValue = <TData>(
  group: KanbanGroupOption<TData>,
  card: TData,
) => normalizeToArray(group.accessor(card))[0] ?? "";

export const collectGroupColumns = <TData>(
  group: KanbanGroupOption<TData>,
  cards: TData[],
): FilterOption[] => {
  if (group.values?.length) return group.values;
  const uniqueValues = new Map<string, string>();
  cards.forEach((card) => {
    const value = getGroupValue(group, card);
    if (!uniqueValues.has(value))
      uniqueValues.set(value, value || "Sin valor");
  });
  return Array.from(uniqueValues.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((first, second) => first.label.localeCompare(second.label, "es"));
};

export const groupCardsByValue = <TData>(
  group: KanbanGroupOption<TData>,
  columns: FilterOption[],
  cards: TData[],
) => {
  const grouped: Record<string, TData[]> = {};
  columns.forEach((column) => {
    grouped[column.value] = [];
  });
  cards.forEach((card) => {
    const value = getGroupValue(group, card);
    if (!grouped[value]) grouped[value] = [];
    grouped[value].push(card);
  });
  return grouped;
};

export const mergeColumnValues = (
  columns: FilterOption[],
  cardsByGroup: Record<string, unknown>,
) => {
  const fromConfig = columns.map((column) => column.value);
  const fromRows = Object.keys(cardsByGroup);
  return Array.from(new Set([...fromConfig, ...fromRows]));
};

export const resolveColumnLabel = (columns: FilterOption[], value: string) => {
  const configuredLabel = columns.find((column) => column.value === value)?.label;
  return (configuredLabel ?? value) || "Sin valor";
};
