import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { FieldControlAttributes } from "../../shared/field/field-props";
import { FloatingPanelAnchor } from "../../shared/floating-panel/FloatingPanel";
import { buildSelectWidthStyle } from "../model/select-width";
import type { CountrySelectView } from "../model/use-country-select";
import { CountryChips } from "./CountryChips";
import { CountrySelectClear } from "./CountrySelectClear";
import { CountrySelectTrigger } from "./CountrySelectTrigger";

interface CountrySelectBoxProps {
  view: CountrySelectView;
  control: FieldControlAttributes;
}

interface BoxPartProps {
  view: CountrySelectView;
}

const SelectionControls = ({ view }: BoxPartProps) => {
  const { resolvedProps, selectedCountries, texts } = view;
  if (selectedCountries.length === 0) return null;
  if (view.multiple) {
    return (
      <CountryChips countries={selectedCountries} flagSettings={view.flagSettings} texts={texts} onRemove={view.removeCountry} classNames={resolvedProps.classNames} />
    );
  }
  if (resolvedProps.required) return null;
  return <CountrySelectClear label={texts.clearSelection} className={resolvedProps.classNames?.clear} onClear={view.clearSelection} />;
};

// The whole box anchors the panel, so it aligns with and measures against the
// full field. The clear button, the chips and the chevron are siblings of the
// combobox: a button inside another one is invalid HTML. The frame holds the
// width, so the field prefers it but can still shrink with its container.
export const CountrySelectBox = ({ view, control }: CountrySelectBoxProps) => {
  const { resolvedProps } = view;
  return (
    <div className="gdy-country-select-frame" style={buildSelectWidthStyle(resolvedProps.width)}>
      <FloatingPanelAnchor>
        <div
          className={cn("gdy-scope gdy-country-select", resolvedProps.className, resolvedProps.classNames?.root)}
          data-multiple={view.multiple || undefined}
        >
          <CountrySelectTrigger view={view} control={control} />
          <SelectionControls view={view} />
          <span className="gdy-country-select-chevron" aria-hidden="true">
            <ChevronDown />
          </span>
        </div>
      </FloatingPanelAnchor>
    </div>
  );
};
