import { cn } from "../../../lib/cn";
import { selectThemeToVars } from "../../shared/select-theme";
import type { SimpleSelectProps } from "./select";
import { SelectTrigger, SelectValue } from "./select-primitives";

type SimpleSelectTriggerProps = Pick<
  SimpleSelectProps,
  "placeholder" | "ariaLabel" | "triggerClassName" | "triggerStyle" | "theme"
>;

const SimpleSelectTrigger = ({
  placeholder,
  ariaLabel,
  triggerClassName,
  triggerStyle,
  theme,
}: SimpleSelectTriggerProps) => {
  const themeVars = selectThemeToVars(theme);
  return (
    <SelectTrigger
      aria-label={ariaLabel}
      className={cn(theme?.triggerClassName, triggerClassName)}
      style={{ ...themeVars, ...triggerStyle }}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
  );
}

export { SimpleSelectTrigger };
