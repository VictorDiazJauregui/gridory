import { selectThemeToVars } from "../../shared/select-theme";
import type { SimpleSelectProps } from "./select";
import { SelectContent, SelectItem } from "./select-primitives";

type SimpleSelectContentProps = Pick<SimpleSelectProps, "options" | "theme">;

const SimpleSelectContent = ({ options, theme }: SimpleSelectContentProps) => {
  const themeVars = selectThemeToVars(theme);
  return (
    <SelectContent className={theme?.contentClassName} style={themeVars}>
      {options.map((option) => (
        <SelectItem
          key={option.value}
          value={option.value}
          className={theme?.itemClassName}
        >
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  );
}

export { SimpleSelectContent };
