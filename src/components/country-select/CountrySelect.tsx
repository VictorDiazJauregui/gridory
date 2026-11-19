import { Field } from "../shared/field/Field";
import { FloatingPanel } from "../shared/floating-panel/FloatingPanel";
import { resolveFieldNaming } from "./model/field-naming";
import { useCountrySelect } from "./model/use-country-select";
import { CountrySelectBox } from "./parts/CountrySelectBox";
import { CountrySelectPanel } from "./parts/CountrySelectPanel";
import type { CountryNotApplicable, CountrySelectProps } from "./types";
import "./styles.css";

export const CountrySelect = <TNotApplicable extends string = CountryNotApplicable>(props: CountrySelectProps<TNotApplicable>) => {
  // Inside, the not applicable answer is any string: the component only ever emits the value it was given.
  const view = useCountrySelect(props as CountrySelectProps<string>);
  return (
    <Field {...resolveFieldNaming(props)} id={props.id} required={view.resolvedProps.required} error={view.error}>
      {(control, labelling) => (
        <FloatingPanel open={view.panel.open} onOpenChange={view.panel.changeOpen}>
          <CountrySelectBox view={view} control={control} />
          <CountrySelectPanel view={view} labelling={labelling} />
        </FloatingPanel>
      )}
    </Field>
  );
};
