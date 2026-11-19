import { cn } from "../../../lib/cn";
import type { AccessibleName } from "../../shared/accessible-name";
import { FloatingPanelContent } from "../../shared/floating-panel/FloatingPanel";
import { Listbox } from "../../shared/listbox/Listbox";
import { listSelectedOptionValues, matchesCountryOrNotApplicable } from "../model/not-applicable-option";
import type { CountrySelectView } from "../model/use-country-select";
import { SelectionLimitStatus } from "./SelectionLimitStatus";

interface CountrySelectPanelProps {
  view: CountrySelectView;
  labelling: AccessibleName;
}

// The list mounts with every opening, so it starts on the chosen country and scrolls it into view. The limit
// status follows the list: the shared listbox keeps its search box and options together.
export const CountrySelectPanel = ({ view, labelling }: CountrySelectPanelProps) => {
  const { resolvedProps, texts } = view;
  return (
    <FloatingPanelContent {...labelling} className={cn("gdy-country-select-panel", resolvedProps.classNames?.panel)}>
      <Listbox
        {...labelling}
        options={view.listOptions}
        selectedValues={listSelectedOptionValues(view.selectedCodes, view.notApplicableChosen)}
        multiple={view.multiple}
        onSelect={view.pickCountry}
        matchesQuery={matchesCountryOrNotApplicable}
        texts={{ searchLabel: texts.searchLabel, searchPlaceholder: texts.searchPlaceholder, noResults: texts.noResults }}
        thinScrollbars={resolvedProps.thinScrollbars}
        scrollbarColor={resolvedProps.scrollbarColor}
      />
      {view.multiple ? <SelectionLimitStatus message={view.limitMessage} /> : null}
    </FloatingPanelContent>
  );
};
