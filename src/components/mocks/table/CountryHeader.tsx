import { Globe } from "lucide-react";
import { useDemoText } from "../shared/demo-dictionary";

// headerContent (1.4.0): the visible title only; "País" stays the column's text everywhere else.
export const CountryHeader = () => {
  const translate = useDemoText();
  return (
    <span className="inline-flex items-center gap-1">
      <Globe size={13} aria-hidden="true" />
      {translate("País")}
    </span>
  );
};
