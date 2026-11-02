import { useRef, useState, type MouseEvent } from "react";
import { CircleHelp } from "lucide-react";
import { Tooltip, VisuallyHidden } from "radix-ui";

interface TableHeaderHelpProps {
  text: string;
  label: string;
}

interface HelpDescriptionProps {
  text: string;
  descriptionId: string;
}

/** The help text for screen readers, linked from the header trigger with aria-describedby. */
export const TableHeaderHelpDescription = ({ text, descriptionId }: HelpDescriptionProps) => (
  <VisuallyHidden.Root id={descriptionId}>{text}</VisuallyHidden.Root>
);

// Radix opens a tooltip on hover and focus only, and closes it on click. A click or tap toggles it here, judged
// by its state when the press began: on a phone the focus arrives after the finger lifts and opens it first.
const useClickToggledOpen = () => {
  const [open, setOpen] = useState(false);
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

export const TableHeaderHelp = ({ text, label }: TableHeaderHelpProps) => {
  const { open, setOpen, rememberOpenOnPress, toggleOnClick } = useClickToggledOpen();
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger
          type="button"
          className="gdy-table-head-help"
          aria-label={label}
          onPointerDown={rememberOpenOnPress}
          onClick={toggleOnClick}
        >
          <CircleHelp size={14} aria-hidden="true" />
        </Tooltip.Trigger>
        <HelpTooltipContent text={text} />
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
