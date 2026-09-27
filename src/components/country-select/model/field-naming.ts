import type { FieldNaming } from "../../shared/field/field-props";
import { DEFAULT_COUNTRY_SELECT_LABEL } from "../constants";
import type { CountrySelectNaming } from "../types";

// Unlike the shared field, the control always has a name: "País" stands in
// when the app gives neither a label nor an ARIA name.
export const resolveFieldNaming = (naming: CountrySelectNaming): FieldNaming => {
  if (naming["aria-labelledby"]) return { "aria-labelledby": naming["aria-labelledby"] };
  if (naming["aria-label"]) return { "aria-label": naming["aria-label"] };
  return { label: naming.label ?? DEFAULT_COUNTRY_SELECT_LABEL };
};
