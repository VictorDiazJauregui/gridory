import { Field } from "../shared/field/Field";
import { FloatingPanel } from "../shared/floating-panel/FloatingPanel";
import { resolveFieldNaming } from "./model/field-naming";
import { useCountrySelect } from "./model/use-country-select";
import { CountrySelectBox } from "./parts/CountrySelectBox";
import { CountrySelectPanel } from "./parts/CountrySelectPanel";
import type { CountrySelectProps } from "./types";
import "./styles.css";

export const CountrySelect = (props: CountrySelectProps) => {
  const view = useCountrySelect(props);
  return (
    <Field {...resolveFieldNaming(props)} required={view.resolvedProps.required} error={view.error}>
      {(control, labelling) => (
        <FloatingPanel open={view.panel.open} onOpenChange={view.panel.changeOpen}>
          <CountrySelectBox view={view} control={control} />
          <CountrySelectPanel view={view} labelling={labelling} />
        </FloatingPanel>
      )}
    </Field>
  );
};
