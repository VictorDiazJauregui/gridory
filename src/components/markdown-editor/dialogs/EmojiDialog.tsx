import { useState } from "react";
import { Clock } from "lucide-react";
import { Tabs } from "radix-ui";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import { EmojiGrid } from "../pickers/EmojiGrid";
import type { EmojiCategory } from "../pickers/emoji-types";
import { findEmojiEntries, searchEmojis } from "../pickers/search-emojis";
import { useEmojiCategories } from "../pickers/use-emoji-categories";
import type { MarkdownEmojiDialogTexts } from "../types";
import type { EmojiDialogProps } from "./dialog-types";
import { MarkdownDialogFrame } from "./MarkdownDialogFrame";

const RECENT_CATEGORY_ID = "recent";

interface EmojiBrowserProps {
  categories: readonly EmojiCategory[];
  recentEmojis: readonly string[];
  texts: MarkdownEmojiDialogTexts;
  onPick: (emoji: string) => void;
}

const withRecentCategory = ({ categories, recentEmojis, texts }: Omit<EmojiBrowserProps, "onPick">): EmojiCategory[] => {
  if (recentEmojis.length === 0) return [...categories];
  return [{ id: RECENT_CATEGORY_ID, label: texts.recent, emojis: findEmojiEntries(categories, recentEmojis) }, ...categories];
};

const CategoryTabIcon = ({ category }: { category: EmojiCategory }) =>
  category.id === RECENT_CATEGORY_ID ? <Clock aria-hidden className="gdy-md-picker-tab-icon" /> : category.emojis[0]?.emoji;

const EmojiCategoryTabs = ({ onPick, ...browser }: EmojiBrowserProps) => {
  const tabs = withRecentCategory(browser);
  return (
    <Tabs.Root defaultValue={tabs[0]?.id} className="gdy-md-picker-tabs">
      <Tabs.List className="gdy-md-picker-tab-list" aria-label={browser.texts.title}>
        {tabs.map((category) => (
          <Tabs.Trigger key={category.id} value={category.id} className="gdy-md-picker-tab" aria-label={category.label} title={category.label}>
            <CategoryTabIcon category={category} />
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((category) => (
        <Tabs.Content key={category.id} value={category.id} className="gdy-md-picker-panel">
          <EmojiGrid label={category.label} emojis={category.emojis} onPick={onPick} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

const EmojiSearchResults = ({ categories, query, texts, onPick }: Omit<EmojiBrowserProps, "recentEmojis"> & { query: string }) => {
  const results = searchEmojis(categories, query);
  return (
    <div className="gdy-md-picker-panel">
      {results.length === 0 ? <p className="gdy-md-picker-status" role="status">{texts.noResults}</p> : <EmojiGrid label={texts.search} emojis={results} onPick={onPick} />}
    </div>
  );
};

const EmojiBrowser = ({ recentEmojis, onPick }: Pick<EmojiDialogProps, "recentEmojis"> & { onPick: (emoji: string) => void }) => {
  const texts = useMarkdownEditorContext("EmojiDialog").texts.dialogs.emoji;
  const categories = useEmojiCategories();
  const [query, setQuery] = useState("");
  return (
    <div className="gdy-md-picker" aria-busy={!categories || undefined}>
      <input type="search" className="gdy-input gdy-md-picker-search" aria-label={texts.search} placeholder={texts.search} value={query} onChange={(event) => setQuery(event.target.value)} autoFocus />
      {!categories && <p className="gdy-md-picker-panel gdy-md-picker-status" role="status">{texts.loading}</p>}
      {categories && query.trim() && <EmojiSearchResults categories={categories} query={query} texts={texts} onPick={onPick} />}
      {categories && !query.trim() && <EmojiCategoryTabs categories={categories} recentEmojis={recentEmojis} texts={texts} onPick={onPick} />}
    </div>
  );
};

export const EmojiDialog = ({ open, onOpenChange, onInsert, recentEmojis }: EmojiDialogProps) => {
  const { texts } = useMarkdownEditorContext("EmojiDialog");
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title={texts.dialogs.emoji.title} className="gdy-md-picker-dialog">
      <EmojiBrowser recentEmojis={recentEmojis} onPick={(emoji) => onInsert({ text: emoji })} />
    </MarkdownDialogFrame>
  );
};
