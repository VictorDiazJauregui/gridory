import { useEffect, useRef, useState, type RefObject } from "react";
import type { EditorController } from "../model/editor-controller";
import type { CodeMirrorControllerOptions } from "./code-mirror-controller";

export type CodeMirrorSetup = Omit<CodeMirrorControllerOptions, "parent">;

const loadCodeMirror = () => import("./code-mirror-controller");

export const useCodeMirrorController = (containerRef: RefObject<HTMLElement | null>, setup: CodeMirrorSetup) => {
  const [controller, setController] = useState<EditorController | null>(null);
  const initialSetup = useRef(setup);
  useEffect(() => {
    const parent = containerRef.current;
    let created: EditorController | null = null;
    let unmounted = false;
    if (!parent) return undefined;
    loadCodeMirror().then(({ createCodeMirrorController }) => {
      if (unmounted) return;
      created = createCodeMirrorController({ ...initialSetup.current, parent });
      setController(created);
    });
    return () => {
      unmounted = true;
      created?.destroy();
    };
  }, [containerRef]);
  return controller;
};
