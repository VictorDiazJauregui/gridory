import type { KeyboardEvent } from "react";
import { Check, Minus } from "lucide-react";
import { createDeferredModule } from "../../shared/deferred/deferred-module";
import { useDeferredModule } from "../../shared/deferred/use-deferred-module";
import { usePlaceholderFocus } from "../../shared/deferred/use-placeholder-focus";
import type { HeaderCheckState } from "./row-selection";
import type { SelectCheckboxProps } from "./SelectCheckbox";

// The Radix checkbox downloads only for tables that turn selection on.
const deferredSelectCheckbox = createDeferredModule(() => import("./SelectCheckbox"));

const toCheckState = (checked: HeaderCheckState) => {
  if (checked === "indeterminate") return { state: "indeterminate", aria: "mixed" } as const;
  return checked ? ({ state: "checked", aria: true } as const) : ({ state: "unchecked", aria: false } as const);
};

// Like Radix, Enter does not toggle a checkbox: only Space (the button's click) does.
const ignoreEnter = (event: KeyboardEvent) => {
  if (event.key === "Enter") event.preventDefault();
};

const disabledAttribute = (disabled?: boolean) => (disabled ? "" : undefined);

const buildDisabledAttributes = (disabled?: boolean) => ({ "data-disabled": disabledAttribute(disabled), disabled });

const CheckIndicator = ({ state, disabled }: { state: "checked" | "indeterminate"; disabled?: boolean }) => (
  <span data-state={state} data-disabled={disabledAttribute(disabled)} className="gdy-table-select-indicator" style={{ pointerEvents: "none" }}>
    {state === "indeterminate" ? <Minus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
  </span>
);

// The same markup Radix renders, so the column keeps its size; it already toggles while the real one downloads.
interface CheckboxPlaceholderProps extends SelectCheckboxProps {
  focusHandlers: ReturnType<typeof usePlaceholderFocus>["focusHandlers"];
}

const CheckboxPlaceholder = ({ checked, label, disabled, onToggle, focusHandlers }: CheckboxPlaceholderProps) => {
  const { state, aria } = toCheckState(checked);
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={aria}
      data-state={state}
      {...buildDisabledAttributes(disabled)}
      value="on"
      className="gdy-table-select"
      aria-label={label}
      onClick={onToggle}
      onKeyDown={ignoreEnter}
      {...focusHandlers}
    >
      {state !== "unchecked" && <CheckIndicator state={state} disabled={disabled} />}
    </button>
  );
};

export const DeferredSelectCheckbox = (props: SelectCheckboxProps) => {
  const { module, status, retry } = useDeferredModule(deferredSelectCheckbox);
  const { focused, focusHandlers } = usePlaceholderFocus();
  if (module) return <module.SelectCheckbox {...props} initiallyFocused={focused} />;
  if (status !== "failed") return <CheckboxPlaceholder {...props} focusHandlers={focusHandlers} />;
  const toggleAndRetry = () => {
    props.onToggle();
    retry();
  };
  return <CheckboxPlaceholder {...props} onToggle={toggleAndRetry} focusHandlers={focusHandlers} />;
};
