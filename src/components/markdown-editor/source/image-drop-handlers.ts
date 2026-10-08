import { EditorView } from "@codemirror/view";

export type ImageFilesHandler = (files: File[], position: number) => boolean;

const readImageFiles = (transfer: DataTransfer | null): File[] =>
  [...(transfer?.files ?? [])].filter((file) => file.type.startsWith("image/"));

const handleFiles = (event: Event, files: File[], run: () => boolean): boolean => {
  if (files.length === 0 || !run()) return false;
  event.preventDefault();
  return true;
};

export const createImageDropHandlers = (readHandler: () => ImageFilesHandler) =>
  EditorView.domEventHandlers({
    paste: (event, view) => {
      const files = readImageFiles(event.clipboardData);
      return handleFiles(event, files, () => readHandler()(files, view.state.selection.main.head));
    },
    drop: (event, view) => {
      const files = readImageFiles(event.dataTransfer);
      const position = view.posAtCoords({ x: event.clientX, y: event.clientY }) ?? view.state.selection.main.head;
      return handleFiles(event, files, () => readHandler()(files, position));
    },
  });
