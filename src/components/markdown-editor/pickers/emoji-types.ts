export interface EmojiEntry {
  emoji: string;
  /** Spanish name, used as the accessible name of the option. */
  name: string;
  /** Spanish and English words the search matches. */
  keywords: string;
}

export interface EmojiCategory {
  id: string;
  label: string;
  emojis: readonly EmojiEntry[];
}
