/**
 * Joins the truthy class names with a space. Used by the table, the kanban and
 * the shared toolbar, which only compose plain `gdy-*` classes and never need
 * Tailwind conflict resolution.
 */
export const cn = (
  ...values: Array<string | false | null | undefined>
): string => values.filter(Boolean).join(" ");
