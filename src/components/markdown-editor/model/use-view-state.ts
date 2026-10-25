import { useMemo } from "react";
import { MARKDOWN_EDITOR_DEFAULTS, MARKDOWN_EDITOR_VIEWS } from "../constants";
import type { MarkdownEditorProviderProps, MarkdownEditorView } from "../types";
import { useControllableValue } from "./use-controllable-value";

type ViewStateOptions = Pick<MarkdownEditorProviderProps, "view" | "defaultView" | "onViewChange" | "views">;

const resolveView = (view: MarkdownEditorView, views: readonly MarkdownEditorView[]): MarkdownEditorView =>
  views.includes(view) ? view : views[0];

export const useViewState = ({ view, defaultView, onViewChange, views = MARKDOWN_EDITOR_VIEWS }: ViewStateOptions) => {
  const [currentView, changeView] = useControllableValue<MarkdownEditorView>({
    value: view,
    defaultValue: defaultView ?? MARKDOWN_EDITOR_DEFAULTS.view,
    onChange: onViewChange,
  });
  const resolvedView = resolveView(currentView, views);
  return useMemo(() => ({ view: resolvedView, views, changeView }), [resolvedView, views, changeView]);
};
