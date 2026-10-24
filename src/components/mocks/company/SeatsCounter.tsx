import { Users } from "lucide-react";

export const SeatsCounter = () => (
  <span className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs text-muted-foreground">
    <Users size={14} />
    Asientos 7/10
  </span>
);
