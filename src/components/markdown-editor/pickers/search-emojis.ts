import { includesNormalizedQuery, normalizeSearchText } from "../../shared/text-search/normalize-search-text";
import type { EmojiCategory, EmojiEntry } from "./emoji-types";

export const searchEmojis = (categories: readonly EmojiCategory[], query: string): EmojiEntry[] => {
  const normalizedQuery = normalizeSearchText(query);
  return categories
    .flatMap((category) => category.emojis)
    .filter((entry) => includesNormalizedQuery(`${entry.name} ${entry.keywords}`, normalizedQuery));
};

export const findEmojiEntries = (categories: readonly EmojiCategory[], emojis: readonly string[]): EmojiEntry[] => {
  const entries = new Map(categories.flatMap((category) => category.emojis.map((entry) => [entry.emoji, entry] as const)));
  return emojis.map((emoji) => entries.get(emoji) ?? { emoji, name: emoji, keywords: "" });
};
