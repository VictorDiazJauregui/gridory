import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { createDeferredModule } from "../../shared/deferred/deferred-module";
import { useDeferredModule } from "../../shared/deferred/use-deferred-module";
import { usePlaceholderFocus } from "../../shared/deferred/use-placeholder-focus";
import type { TableHeaderHelpProps } from "./TableHeaderHelp";

// The tooltip (Radix) downloads only for tables whose columns declare headerTooltip.
const deferredHeaderHelp = createDeferredModule(() => import("./TableHeaderHelp"));

interface HelpPlaceholderProps {
  label: string;
  onPress: () => void;
  focusHandlers: ReturnType<typeof usePlaceholderFocus>["focusHandlers"];
}

// The trigger as Radix renders it while closed, so the header keeps its width.
const HelpPlaceholder = ({ label, onPress, focusHandlers }: HelpPlaceholderProps) => (
  <button data-state="closed" type="button" className="gdy-table-head-help" aria-label={label} onClick={onPress} {...focusHandlers}>
    <CircleHelp size={14} aria-hidden="true" />
  </button>
);

// A press or the focus before the tooltip arrives is kept, so it opens on arrival, as Radix opens on focus; after a
// failed download a press also retries.
export const DeferredTableHeaderHelp = (props: TableHeaderHelpProps) => {
  const { module, status, retry } = useDeferredModule(deferredHeaderHelp);
  const [pressed, setPressed] = useState(false);
  const { focused, focusHandlers } = usePlaceholderFocus();
  if (module) return <module.TableHeaderHelp {...props} initiallyOpen={pressed || focused} initiallyFocused={focused} />;
  const press = () => {
    setPressed(true);
    if (status === "failed") retry();
  };
  return <HelpPlaceholder label={props.label} onPress={press} focusHandlers={focusHandlers} />;
};
