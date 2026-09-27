import type { FieldNaming } from "../../shared/field/field-props";
import { DEFAULT_PHONE_INPUT_LABEL } from "../constants";
import type { PhoneInputNaming } from "../types";

// Unlike the shared field, the number always has a name: "Teléfono" stands in
// when the app gives neither a label nor an ARIA name.
export const resolvePhoneFieldNaming = (naming: PhoneInputNaming): FieldNaming => {
  if (naming["aria-labelledby"]) return { "aria-labelledby": naming["aria-labelledby"] };
  if (naming["aria-label"]) return { "aria-label": naming["aria-label"] };
  return { label: naming.label ?? DEFAULT_PHONE_INPUT_LABEL };
};
