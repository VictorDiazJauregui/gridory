import {
  DuplicateAuthFieldError,
  UnknownAuthFieldError,
} from "../validation/auth-field-errors";
import type { ResolvedAuthField } from "./resolved-field";

// Hidden built-in fields (`lastName: false`) may still appear in fieldOrder.
const BUILT_IN_FIELD_NAMES = new Set([
  "firstName",
  "lastName",
  "email",
  "password",
  "confirmPassword",
]);

export const assertUniqueFieldNames = (fields: ResolvedAuthField[]): void => {
  const seen = new Set<string>();
  for (const field of fields) {
    if (seen.has(field.name)) throw new DuplicateAuthFieldError(field.name);
    seen.add(field.name);
  }
};

const pickListedFields = (
  byName: Map<string, ResolvedAuthField>,
  order: string[],
): ResolvedAuthField[] =>
  [...new Set(order)].flatMap((name) => {
    const field = byName.get(name);
    if (field) return [field];
    if (BUILT_IN_FIELD_NAMES.has(name)) return [];
    throw new UnknownAuthFieldError(name);
  });

export const applyFieldOrder = (
  fields: ResolvedAuthField[],
  order: string[] | undefined,
): ResolvedAuthField[] => {
  if (!order) return fields;
  const listed = pickListedFields(
    new Map(fields.map((field) => [field.name, field])),
    order,
  );
  const listedNames = new Set(listed.map((field) => field.name));
  return [...listed, ...fields.filter((field) => !listedNames.has(field.name))];
};
