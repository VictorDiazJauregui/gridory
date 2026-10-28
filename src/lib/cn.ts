// Plain concatenation: every module composes `gdy-*` hooks plus the consumer's `className` or `classNames`
// slot, so there is no utility conflict to resolve.
export const cn = (
  ...values: Array<string | false | null | undefined>
): string => values.filter(Boolean).join(" ");
