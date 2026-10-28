import { useCallback, useEffect, useState } from "react";

export interface Announcement {
  text: string;
  /** Changes on every announcement, so the same text twice in a row is read again. */
  count: number;
}

interface FocusRequest {
  cardId: string;
  count: number;
}

const NO_ANNOUNCEMENT: Announcement = { text: "", count: 0 };

// A moved card mounts again inside its new column, so the ⋯ button that had the focus is gone. Radix
// gives the focus back on a timeout when the menu unmounts; this one runs after it.
const useFocusRequest = (triggers: Map<string, HTMLElement>) => {
  const [request, setRequest] = useState<FocusRequest | null>(null);
  useEffect(() => {
    if (!request) return undefined;
    const timer = setTimeout(() => triggers.get(request.cardId)?.focus(), 0);
    return () => clearTimeout(timer);
  }, [request, triggers]);
  return useCallback((cardId: string) => setRequest((previous) => ({ cardId, count: (previous?.count ?? 0) + 1 })), []);
};

/** Screen reader announcements and focus of the moves made from the "Move to" menu. */
export const useMoveFeedback = () => {
  const [triggers] = useState(() => new Map<string, HTMLElement>());
  const [announcement, setAnnouncement] = useState(NO_ANNOUNCEMENT);
  const focusCard = useFocusRequest(triggers);
  const announce = useCallback((text: string) => setAnnouncement((previous) => ({ text, count: previous.count + 1 })), []);
  const registerTrigger = useCallback((cardId: string, element: HTMLElement | null) => {
    if (element) triggers.set(cardId, element);
  }, [triggers]);
  // Nothing has the focus when the moved card went to a column the filters hide: it follows the card back.
  const ownsFocus = useCallback((cardId: string) => {
    const focused = document.activeElement;
    return focused === null || focused === document.body || focused === triggers.get(cardId);
  }, [triggers]);
  return { announcement, announce, focusCard, ownsFocus, registerTrigger };
};

export type MoveFeedback = ReturnType<typeof useMoveFeedback>;
