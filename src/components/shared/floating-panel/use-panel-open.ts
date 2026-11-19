import { useState } from "react";

// Closed while disabled, and adjusted during render instead of in an effect: enabling the control again must
// not bring back a list the person never reopened.
export const usePanelOpen = (disabled: boolean) => {
  const [open, setOpen] = useState(false);
  if (disabled && open) setOpen(false);
  return { open: open && !disabled, setOpen };
};
