import { useState } from "react";
import type { AuthFieldErrors } from "../types";

interface EditedFields {
  source?: AuthFieldErrors;
  names: Set<string>;
}

const NO_EDITED_FIELDS = new Set<string>();

/**
 * A server error (`fieldErrors`) hides once its field is edited, and comes
 * back as soon as the app passes a new `fieldErrors` object.
 */
export const useServerErrors = (fieldErrors: AuthFieldErrors | undefined) => {
  const [edited, setEdited] = useState<EditedFields>({ names: NO_EDITED_FIELDS });
  const editedNames = edited.source === fieldErrors ? edited.names : NO_EDITED_FIELDS;
  const serverErrorFor = (name: string): string | undefined =>
    editedNames.has(name) ? undefined : fieldErrors?.[name];
  const dismissServerError = (name: string) => {
    if (!fieldErrors?.[name] || editedNames.has(name)) return;
    setEdited({ source: fieldErrors, names: new Set([...editedNames, name]) });
  };
  return { serverErrorFor, dismissServerError };
};
