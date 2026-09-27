import { useRef } from "react";
import { useSidebar } from "../../components/sidebar";

// Stands for a footer menu that opens in a portal: it holds the sidebar open.
export const RetainingBlock = () => {
  const { retainExpanded } = useSidebar();
  const release = useRef<(() => void) | null>(null);
  const toggle = () => {
    if (release.current) {
      release.current();
      release.current = null;
      return;
    }
    release.current = retainExpanded();
  };
  return (
    <button type="button" onClick={toggle}>
      Menú de cuenta
    </button>
  );
};
