export interface TextSelection {
  from: number;
  to: number;
}

export interface EditorSnapshot {
  text: string;
  selection: TextSelection;
}

export interface TextChange {
  from: number;
  to: number;
  insert: string;
}

export interface CommandResult {
  changes: TextChange[];
  selection: TextSelection;
}

/** A pure edit: it reads the text and the selection and returns what to change, never touching the DOM. */
export type MarkdownCommand = (snapshot: EditorSnapshot) => CommandResult;
