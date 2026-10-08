import { Columns2, Eye, PenLine, type LucideIcon } from "lucide-react";
import { cn } from "../../../lib/cn";
import { useMarkdownEditorContext, type MarkdownEditorContextValue } from "../model/markdown-editor-context";
import { readDisplayedView, type SplitTab } from "../model/use-narrow-layout";
import type { MarkdownEditorView } from "../types";

const VIEW_ICONS: Record<MarkdownEditorView, LucideIcon> = {
  source: PenLine,
  split: Columns2,
  preview: Eye,
};

const SPLIT_TABS: readonly SplitTab[] = ["source", "preview"];

export interface MarkdownViewSwitchProps {
  className?: string;
}

const readSwitchOptions = ({ views, view, narrowLayout }: MarkdownEditorContextValue): readonly MarkdownEditorView[] => {
  if (!narrowLayout) return views;
  return view === "split" ? SPLIT_TABS : views.filter((option) => option !== "split");
};

const useSwitchAction = (editor: MarkdownEditorContextValue) => (option: MarkdownEditorView) => {
  if (editor.narrowLayout && editor.view === "split" && option !== "split") return editor.changeSplitTab(option);
  editor.changeView(option);
};

export const MarkdownViewSwitch = ({ className }: MarkdownViewSwitchProps) => {
  const editor = useMarkdownEditorContext("MarkdownViewSwitch");
  const options = readSwitchOptions(editor);
  const displayedView = readDisplayedView(editor);
  const choose = useSwitchAction(editor);
  if (options.length < 2) return null;
  return (
    <div role="group" aria-label={editor.texts.viewSwitchLabel} className={cn("gdy-md-view-switch", className)}>
      {options.map((option) => {
        const Icon = VIEW_ICONS[option];
        return (
          <button key={option} type="button" className="gdy-md-view-option" aria-pressed={displayedView === option} title={editor.texts.viewLabels[option]} aria-label={editor.texts.viewLabels[option]} onClick={() => choose(option)}>
            <Icon aria-hidden className="gdy-md-view-icon" />
          </button>
        );
      })}
    </div>
  );
};
