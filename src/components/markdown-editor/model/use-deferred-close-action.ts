import { useRef } from "react";

type CloseAction = () => void;

export const useDeferredCloseAction = () => {
  const pendingAction = useRef<CloseAction | null>(null);
  return {
    runAfterClose: (action: CloseAction) => {
      pendingAction.current = action;
    },
    onCloseAutoFocus: (event: Event) => {
      const action = pendingAction.current;
      pendingAction.current = null;
      if (!action) return;
      event.preventDefault();
      action();
    },
  };
};
