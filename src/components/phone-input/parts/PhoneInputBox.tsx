import { cn } from "../../../lib/cn";
import { FloatingPanelAnchor } from "../../shared/floating-panel/FloatingPanel";
import { buildPhoneWidthStyle } from "../model/phone-width";
import type { PhoneInputView } from "../model/use-phone-input";
import { PhoneInputPrefix } from "./PhoneInputPrefix";
import { PhoneNumberInput, type PhoneNumberAttributes } from "./PhoneNumberInput";

interface PhoneInputBoxProps {
  view: PhoneInputView;
  control: PhoneNumberAttributes;
  onBlur?: () => void;
}

// The whole box anchors the list, so it is never narrower than the field. The
// box draws the border and the focus of both parts: they share one frame.
export const PhoneInputBox = ({ view, control, onBlur }: PhoneInputBoxProps) => {
  const { resolvedSettings } = view;
  return (
    <div className="gdy-phone-input-frame" style={buildPhoneWidthStyle(resolvedSettings.width)}>
      <FloatingPanelAnchor>
        <div
          className={cn("gdy-scope gdy-phone-input", resolvedSettings.className, resolvedSettings.classNames?.root)}
          data-invalid={control["aria-invalid"] ? "" : undefined}
        >
          <PhoneInputPrefix view={view} />
          <PhoneNumberInput view={view} control={control} onBlur={onBlur} />
        </div>
      </FloatingPanelAnchor>
    </div>
  );
};
