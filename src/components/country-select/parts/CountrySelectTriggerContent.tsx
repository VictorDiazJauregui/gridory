import { CountryFlag } from "../../shared/countries/CountryFlag";
import { fillTextTemplate } from "../model/fill-text-template";
import type { CountrySelectView } from "../model/use-country-select";
import { CountrySelectValue } from "./CountrySelectValue";

interface TriggerContentProps {
  view: CountrySelectView;
}

const SingleTriggerContent = ({ view }: TriggerContentProps) => {
  const country = view.selectedCountries.at(0);
  return (
    <>
      {country ? <CountryFlag code={country.code} settings={view.flagSettings} /> : null}
      <CountrySelectValue
        text={country?.name ?? view.texts.placeholder}
        isPlaceholder={!country}
        className={view.resolvedProps.classNames?.value}
      />
    </>
  );
};

// The chips are siblings of the combobox, not part of it, so it reads a
// hidden summary of them instead.
const MultipleTriggerContent = ({ view }: TriggerContentProps) => {
  const count = view.selectedCountries.length;
  if (count > 0) {
    return <span className="gdy-country-select-summary">{fillTextTemplate(view.texts.selectedCountries, { count })}</span>;
  }
  return (
    <CountrySelectValue text={view.texts.multiplePlaceholder} isPlaceholder className={view.resolvedProps.classNames?.value} />
  );
};

export const CountrySelectTriggerContent = ({ view }: TriggerContentProps) =>
  view.multiple ? <MultipleTriggerContent view={view} /> : <SingleTriggerContent view={view} />;
