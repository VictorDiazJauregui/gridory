import { useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { createPortal } from "react-dom";
import { CircleHelp } from "lucide-react";
import { placeHelpTooltip } from "./help-tooltip-position";
import { useHelpTooltip } from "./use-help-tooltip";

export interface TableHeaderHelpProps {
  text: string;
  label: string;
}

const HIDDEN_UNTIL_PLACED: CSSProperties = { position: "fixed", visibility: "hidden" };

const HelpTooltipContent = ({ text, triggerRef }: { text: string; triggerRef: RefObject<HTMLButtonElement | null> }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<ReturnType<typeof placeHelpTooltip>>();
  useLayoutEffect(() => {
    const trigger = triggerRef.current?.getBoundingClientRect();
    const content = contentRef.current?.getBoundingClientRect();
    if (trigger && content) setPlacement(placeHelpTooltip(trigger, content));
  }, [triggerRef]);
  return createPortal(
    <div ref={contentRef} role="tooltip" data-side={placement?.side} className="gdy-scope gdy-table-head-tooltip"
      style={placement?.style ?? HIDDEN_UNTIL_PLACED}>
      {text}
    </div>,
    document.body,
  );
};

// The header links the text for screen readers with aria-describedby (TableHeaderHelpDescription); the popup is the
// visual copy, so it does not need its own id.
export const TableHeaderHelp = ({ text, label }: TableHeaderHelpProps) => {
  const { open, triggerRef, triggerHandlers } = useHelpTooltip();
  return (
    <>
      <button ref={triggerRef} data-state={open ? "delayed-open" : "closed"} type="button" className="gdy-table-head-help"
        aria-label={label} {...triggerHandlers}>
        <CircleHelp size={14} aria-hidden="true" />
      </button>
      {open && <HelpTooltipContent text={text} triggerRef={triggerRef} />}
    </>
  );
};
