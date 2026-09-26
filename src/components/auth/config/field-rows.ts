import type { ResolvedAuthField } from "./resolved-field";

export type AuthFieldRow = ResolvedAuthField[];

const NAME_FIELDS = new Set(["firstName", "lastName"]);

const canShareRow = (row: AuthFieldRow, field: ResolvedAuthField): boolean =>
  row.length === 1 &&
  NAME_FIELDS.has(row[0].name) &&
  NAME_FIELDS.has(field.name);

/** First and last name share a row when they are next to each other. */
export const groupFieldRows = (fields: ResolvedAuthField[]): AuthFieldRow[] =>
  fields.reduce<AuthFieldRow[]>((rows, field) => {
    const lastRow = rows.at(-1);
    if (lastRow && canShareRow(lastRow, field)) {
      return [...rows.slice(0, -1), [...lastRow, field]];
    }
    return [...rows, [field]];
  }, []);
