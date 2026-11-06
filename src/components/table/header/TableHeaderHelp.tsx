import { useRef, useState, type MouseEvent } from "react";
import { CircleHelp } from "lucide-react";
import { useFocusOnMount } from "../../shared/deferred/use-placeholder-focus";
import { Tooltip } from "radix-ui";

export interface TableHeaderHelpProps {
  text: string;
  label: string;
  initiallyOpen?: boolean;
  initiallyFocused?: boolean;
}

// Radix opens a tooltip on hover and focus only, and closes it on click. A click or tap toggles it here, judged
// by its state when the press began: on a phone the focus arrives after the finger lifts and opens it first.
const useClickToggledOpen = (initiallyOpen = false) => {
  const [open, setOpen] = useState(initiallyOpen);
  const openOnPressRef = useRef<boolean | null>(null);
  const rememberOpenOnPress = () => {
    openOnPressRef.current = open;
  };
  const toggleOnClick = (event: MouseEvent) => {
    event.preventDefault();
    const wasOpen = openOnPressRef.current ?? open;
    openOnPressRef.current = null;
    setOpen(!wasOpen);
  };
  return { open, setOpen, rememberOpenOnPress, toggleOnClick };
};

const HelpTooltipContent = ({ text }: { text: string }) => (
  <Tooltip.Portal>
    <Tooltip.Content className="gdy-scope gdy-table-head-tooltip" sideOffset={6} collisionPadding={8}>
      {text}
    </Tooltip.Content>
  </Tooltip.Portal>
);

interface HelpTriggerProps {
  label: string;
  initiallyFocused?: boolean;
  toggle: Pick<ReturnType<typeof useClickToggledOpen>, "rememberOpenOnPress" | "toggleOnClick">;
}

const HelpTrigger = ({ label, initiallyFocused, toggle }: HelpTriggerProps) => {
  const triggerRef = useFocusOnMount<HTMLButtonElement>(initiallyFocused);
  return (
    <Tooltip.Trigger
      ref={triggerRef}
      type="button"
      className="gdy-table-head-help"
      aria-label={label}
      onPointerDown={toggle.rememberOpenOnPress}
      onClick={toggle.toggleOnClick}
    >
      <CircleHelp size={14} aria-hidden="true" />
    </Tooltip.Trigger>
  );
};

export const TableHeaderHelp = ({ text, label, initiallyOpen, initiallyFocused }: TableHeaderHelpProps) => {
  const { open, setOpen, ...toggle } = useClickToggledOpen(initiallyOpen);
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <HelpTrigger label={label} initiallyFocused={initiallyFocused} toggle={toggle} />
        <HelpTooltipContent text={text} />
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
