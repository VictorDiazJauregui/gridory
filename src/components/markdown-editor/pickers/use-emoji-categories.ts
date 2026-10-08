import { useEffect, useState } from "react";
import type { EmojiCategory } from "./emoji-types";

export const useEmojiCategories = (): readonly EmojiCategory[] | null => {
  const [categories, setCategories] = useState<readonly EmojiCategory[] | null>(null);
  useEffect(() => {
    let unmounted = false;
    void import("./emoji-data").then((module) => !unmounted && setCategories(module.EMOJI_CATEGORIES));
    return () => {
      unmounted = true;
    };
  }, []);
  return categories;
};
