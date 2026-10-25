import { useMemo, useState } from "react";
import type { MarkdownEditorProviderProps, MarkdownEditorState } from "../types";
import { DEFAULT_CODE_LANGUAGES } from "../code/code-languages";
import { DEFAULT_DIAGRAM_TEMPLATES } from "../diagrams/diagram-templates";
import { DEFAULT_ACCEPTED_IMAGE_TYPES, DEFAULT_MARKDOWN_EDITOR_LIMITS, DEFAULT_MAX_IMAGE_BYTES } from "../constants";
import { formatDateTimeByDefault } from "./format-date-time";
import type { EditorHistoryState } from "./markdown-editor-context";
import { useControllableValue } from "./use-controllable-value";
import { useDialogState } from "./use-dialog-state";
import { useEditorControllerActions } from "./use-editor-controller-actions";
import { useRecentEmojis } from "./use-recent-emojis";
import { useOutlineState } from "./use-outline-state";
import { useNarrowLayoutState } from "./use-narrow-layout";
import { useFullscreenState } from "./use-fullscreen-state";
import { useViewState } from "./use-view-state";

const NO_GUIDE_CHANGES = {};

const EMPTY_HISTORY: EditorHistoryState = { canUndo: false, canRedo: false };

type EditorStateProps = Omit<MarkdownEditorProviderProps, "children" | "texts" | "renderOptions" | "tools">;


const useImageUploadSettings = ({ onImageUpload, acceptedImageTypes, maxImageBytes }: EditorStateProps) =>
  useMemo(
    () => ({
      handler: onImageUpload,
      rules: { acceptedTypes: acceptedImageTypes ?? DEFAULT_ACCEPTED_IMAGE_TYPES, maxBytes: maxImageBytes ?? DEFAULT_MAX_IMAGE_BYTES },
    }),
    [onImageUpload, acceptedImageTypes, maxImageBytes],
  );

const useEditorFeatures = (props: EditorStateProps) => {
  const [previewPanel, attachPreviewPanel] = useState<HTMLElement | null>(null);
  const layout = useNarrowLayoutState();
  return {
    ...layout,
    previewPanel,
    attachPreviewPanel,
    dialogs: props.dialogs,
    diagrams: props.diagrams,
    diagramTemplates: props.diagramTemplates ?? DEFAULT_DIAGRAM_TEMPLATES,
    formulas: props.formulas,
    guide: props.guide || NO_GUIDE_CHANGES,
  };
};

export const useEditorState = (props: EditorStateProps) => {
  const [value, changeValue] = useControllableValue({ ...props, defaultValue: props.defaultValue ?? "" });
  const [history, changeHistory] = useState(EMPTY_HISTORY);
  const viewState = useViewState(props);
  const fullscreenState = useFullscreenState(props.onFullscreenChange);
  const outlineState = useOutlineState(props);
  const { controller, attachController, actions } = useEditorControllerActions();
  const dialogState = useDialogState(actions.readSelectedText);
  const { locale, formatDateTime = formatDateTimeByDefault } = props;
  const editorState = useMemo<MarkdownEditorState>(
    () => ({ ...actions, ...history, ...viewState, ...fullscreenState, ...outlineState, value, openDialog: dialogState.openDialog, formatNow: () => formatDateTime(new Date(), locale) }),
    [actions, history, viewState, fullscreenState, outlineState, value, dialogState.openDialog, formatDateTime, locale],
  );
  const imageUpload = useImageUploadSettings(props);
  const codeLanguages = props.codeLanguages ?? DEFAULT_CODE_LANGUAGES;
  const limits = useMemo(() => ({ ...DEFAULT_MARKDOWN_EDITOR_LIMITS, ...props.limits }), [props.limits]);
  const emojiHistory = useRecentEmojis(props.onEmojiSelect);
  return { editorState, dialogState, controller, attachController, changeValue, changeHistory, ...useEditorFeatures(props), imageUpload, codeLanguages, limits, emojiHistory };
};
