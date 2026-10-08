import { useCallback, useMemo, useState } from "react";
import type { EmojiHistory } from "./markdown-editor-context";

const MAX_RECENT_EMOJIS = 16;

export const useRecentEmojis = (onEmojiSelect?: (emoji: string) => void): EmojiHistory => {
  const [recentEmojis, setRecentEmojis] = useState<readonly string[]>([]);
  const rememberEmoji = useCallback(
    (emoji: string) => {
      setRecentEmojis((current) => [emoji, ...current.filter((item) => item !== emoji)].slice(0, MAX_RECENT_EMOJIS));
      onEmojiSelect?.(emoji);
    },
    [onEmojiSelect],
  );
  return useMemo(() => ({ recentEmojis, rememberEmoji }), [recentEmojis, rememberEmoji]);
};
