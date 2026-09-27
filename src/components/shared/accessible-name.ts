export type AccessibleName =
  | { "aria-labelledby": string; "aria-label"?: never }
  | { "aria-label": string; "aria-labelledby"?: never };
