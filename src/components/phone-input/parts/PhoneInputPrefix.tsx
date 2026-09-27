import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn";
import { CountryFlag } from "../../shared/countries/CountryFlag";
import { FloatingPanelTrigger } from "../../shared/floating-panel/FloatingPanel";
import type { PhoneInputView } from "../model/use-phone-input";

interface PhoneInputPrefixProps {
  view: PhoneInputView;
}

const COUNTRY_MARK = "{country}";

const resolvePrefixName = ({ selectedCountry, texts }: PhoneInputView): string => {
  const country = selectedCountry ? `${selectedCountry.name} ${selectedCountry.dialCode ?? ""}` : texts.countryPlaceholder;
  return texts.prefixButton.replace(COUNTRY_MARK, country.trim());
};

// A button with role combobox, named after the chosen country: the visible
// dial code alone does not tell Canada from the United States.
export const PhoneInputPrefix = ({ view }: PhoneInputPrefixProps) => {
  const { selectedCountry, texts } = view;
  return (
    <FloatingPanelTrigger>
      <button
        type="button"
        role="combobox"
        className={cn("gdy-phone-input-prefix", view.resolvedSettings.classNames?.prefix)}
        aria-label={resolvePrefixName(view)}
        title={selectedCountry?.name}
      >
        {selectedCountry ? <CountryFlag code={selectedCountry.code} settings={view.flagSettings} /> : null}
        <span className="gdy-phone-input-dial-code" data-placeholder={selectedCountry ? undefined : ""}>
          {selectedCountry?.dialCode ?? texts.countryPlaceholder}
        </span>
        <ChevronDown className="gdy-phone-input-chevron" aria-hidden="true" />
      </button>
    </FloatingPanelTrigger>
  );
};
