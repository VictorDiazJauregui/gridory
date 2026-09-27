import { cn } from "../../../lib/cn";
import { matchesCountryOption } from "../../shared/countries/country-listbox-options";
import { FloatingPanelContent } from "../../shared/floating-panel/FloatingPanel";
import { Listbox } from "../../shared/listbox/Listbox";
import type { PhoneInputView } from "../model/use-phone-input";

interface PhoneInputPanelProps {
  view: PhoneInputView;
}

// The list mounts with every opening, so it starts on the chosen country and
// scrolls it into view. It searches by name, ISO code and dial code, accents aside.
export const PhoneInputPanel = ({ view }: PhoneInputPanelProps) => {
  const { resolvedSettings, texts } = view;
  const country = view.value.country;
  return (
    <FloatingPanelContent aria-label={texts.prefixList} className={cn("gdy-phone-input-panel", resolvedSettings.classNames?.panel)}>
      <Listbox
        aria-label={texts.prefixList}
        options={view.options}
        selectedValues={country ? [country] : []}
        onSelect={view.pickCountry}
        matchesQuery={matchesCountryOption}
        texts={{ searchLabel: texts.searchLabel, searchPlaceholder: texts.searchPlaceholder, noResults: texts.noResults }}
        thinScrollbars={resolvedSettings.thinScrollbars}
        scrollbarColor={resolvedSettings.scrollbarColor}
      />
    </FloatingPanelContent>
  );
};
