import { SegmentedControl } from "../../../segmented-control";
import { recordValueChange } from "../record-value-change";
import type { RecordingExampleProps } from "../record-value-change";
import { ControlExample } from "../ControlExample";
import { CALENDAR_VIEW_OPTIONS, COMPANY_VIEW_OPTIONS, CUSTOM_SEGMENTED_TOKENS } from "./segmented-options";

const ICONS_TITLE = "Con iconos";
const ICON_END_TITLE = "Icono al final";
const NO_ANIMATION_TITLE = "Sin animación";
const CUSTOM_TOKENS_TITLE = "Personalizado (solo tokens)";

export const IconsExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={ICONS_TITLE}>
    <SegmentedControl
      options={COMPANY_VIEW_OPTIONS}
      defaultValue="companies"
      onValueChange={recordValueChange(record, ICONS_TITLE)}
      aria-label="Vista de empresa"
    />
  </ControlExample>
);

export const IconEndExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={ICON_END_TITLE} titleId="segmented-icon-end-title">
    <SegmentedControl
      options={COMPANY_VIEW_OPTIONS}
      defaultValue="companies"
      iconPosition="end"
      onValueChange={recordValueChange(record, ICON_END_TITLE)}
      aria-labelledby="segmented-icon-end-title"
    />
  </ControlExample>
);

export const NoAnimationExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={NO_ANIMATION_TITLE} titleId="segmented-no-animation-title">
    <SegmentedControl
      options={CALENDAR_VIEW_OPTIONS}
      defaultValue="month"
      animated={false}
      onValueChange={recordValueChange(record, NO_ANIMATION_TITLE)}
      aria-labelledby="segmented-no-animation-title"
    />
  </ControlExample>
);

export const CustomTokensExample = ({ record }: RecordingExampleProps) => (
  <ControlExample title={CUSTOM_TOKENS_TITLE} titleId="segmented-custom-tokens-title">
    <div className="min-w-0" style={CUSTOM_SEGMENTED_TOKENS}>
      <SegmentedControl
        options={COMPANY_VIEW_OPTIONS}
        defaultValue="companies"
        onValueChange={recordValueChange(record, CUSTOM_TOKENS_TITLE)}
        aria-labelledby="segmented-custom-tokens-title"
      />
    </div>
  </ControlExample>
);
