import { useState } from "react";

/**
 * Open state of the list. The control counts as touched once the list closes
 * for the first time, or once a chip is removed with the list closed: its own
 * error waits until then, so it never shows while the person is still choosing.
 */
export const useCountryPanel = () => {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const changeOpen = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setTouched(true);
  };
  const markTouched = () => setTouched(true);
  return { open, touched, changeOpen, markTouched };
};

export type CountryPanel = ReturnType<typeof useCountryPanel>;
