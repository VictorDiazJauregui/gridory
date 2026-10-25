import type { EmojiEntry } from "./emoji-types";
import { PickerGrid } from "./PickerGrid";

export interface EmojiGridProps {
  label: string;
  emojis: readonly EmojiEntry[];
  onPick: (emoji: string) => void;
}

export const EmojiGrid = ({ label, emojis, onPick }: EmojiGridProps) => {
  const options = emojis.map((entry) => ({ key: entry.emoji, label: entry.name, content: entry.emoji, onPick: () => onPick(entry.emoji) }));
  return <PickerGrid label={label} options={options} />;
};
