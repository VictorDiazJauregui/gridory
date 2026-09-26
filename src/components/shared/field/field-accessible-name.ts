import type { FieldNaming } from "./field-props";
import { hasVisibleContent } from "./visible-content";

export class MissingFieldLabelError extends Error {
  constructor() {
    super(
      "Field needs a visible label, an aria-label or an aria-labelledby: " +
        "without one of them its control has no accessible name.",
    );
    this.name = "MissingFieldLabelError";
  }
}

// The union type already rejects a nameless field at compile time; this guard
// covers JavaScript consumers and labels that are present but empty.
export const assertFieldHasAccessibleName = (naming: FieldNaming): void => {
  const names = [naming.label, naming["aria-label"], naming["aria-labelledby"]];
  if (!names.some(hasVisibleContent)) throw new MissingFieldLabelError();
};
