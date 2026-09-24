import { normalizeToArray } from "../../shared/rows/row-pipeline";
import type { ColumnDefinition } from "../types";

export const formatDateValue = (value: string) => {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

export const summarizeCard = <TData>(
  card: TData,
  fields: ColumnDefinition<TData>[],
) => {
  const [primaryField, secondaryField] = fields;
  const title =
    normalizeToArray(primaryField?.accessor(card) ?? "").join(", ") || "Card";
  const subtitle = secondaryField
    ? normalizeToArray(secondaryField.accessor(card)).join(", ")
    : "";
  return { title, subtitle };
};
