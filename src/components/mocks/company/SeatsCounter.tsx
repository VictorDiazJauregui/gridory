import { Users } from "lucide-react";
import { useDemoText } from "../shared/demo-dictionary";

export const SeatsCounter = () => {
  const translate = useDemoText();
  return (
    <span className="inline-flex h-8 items-center gap-1.5 rounded-gdy-md border px-2.5 text-xs text-gdy-muted-foreground">
      <Users size={14} />
      {translate("Asientos 7/10")}
    </span>
  );
};
