/**
 * Joins the truthy class names with a space. Every module composes plain
 * `gdy-*` hooks plus the classes the consumer passes through `className` or
 * a `classNames` slot, so there is no utility conflict to resolve: the inputs
 * are concatenated as they come.
 */
export const cn = (
  ...values: Array<string | false | null | undefined>
): string => values.filter(Boolean).join(" ");
