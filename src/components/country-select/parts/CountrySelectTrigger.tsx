import { cn } from "../../../lib/cn";
import type { FieldControlAttributes } from "../../shared/field/field-props";
import { FloatingPanelTrigger } from "../../shared/floating-panel/FloatingPanel";
import type { CountrySelectView } from "../model/use-country-select";
import { CountrySelectTriggerContent } from "./CountrySelectTriggerContent";

interface CountrySelectTriggerProps {
  view: CountrySelectView;
  control: FieldControlAttributes;
}

// Full names on hover: the single value truncates and the chips let the pointer through to the combobox.
const resolveTitle = ({ selectedCountries }: CountrySelectView): string | undefined =>
  selectedCountries.map((country) => country.name).join(", ") || undefined;

// A button with role combobox: aria-required is not valid on a plain button.
// Radix adds aria-expanded, aria-controls and aria-haspopup="dialog", which is
// what opens: a dialog with the search box and the list.
export const CountrySelectTrigger = ({ view, control }: CountrySelectTriggerProps) => (
  <FloatingPanelTrigger>
    <button
      type="button"
      role="combobox"
      className={cn("gdy-country-select-trigger", view.resolvedProps.classNames?.trigger)}
      title={resolveTitle(view)}
      {...control}
    >
      <CountrySelectTriggerContent view={view} />
    </button>
  </FloatingPanelTrigger>
);
