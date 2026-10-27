import { useState } from "react";
import type { ToolbarCustomSlot } from "../../table";
import { LoadingToggle } from "./LoadingToggle";

// Demo switch for the `loading` prop: the app decides when its data is on the way.
export const useLoadingToggle = () => {
  const [loading, setLoading] = useState(false);
  const slot: ToolbarCustomSlot = {
    id: "loading",
    content: <LoadingToggle loading={loading} onToggle={() => setLoading((current) => !current)} />,
  };
  return { loading, slot };
};
