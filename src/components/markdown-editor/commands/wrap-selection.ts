import type { CommandResult, EditorSnapshot, MarkdownCommand } from "./command-types";

const countRunBefore = (text: string, end: number, character: string): number =>
  end - text.slice(0, end).replace(new RegExp(`\\${character}+$`), "").length;

const countRunAfter = (text: string, start: number, character: string): number =>
  text.length - start - text.slice(start).replace(new RegExp(`^\\${character}+`), "").length;

const hasMarkerRun = (leftRun: number, rightRun: number, marker: string): boolean => {
  const required = marker.length;
  if (leftRun < required || rightRun < required) return false;
  return required > 1 || (leftRun % 2 === 1 && rightRun % 2 === 1);
};

const isWrappedOutside = ({ text, selection }: EditorSnapshot, marker: string): boolean => {
  const character = marker[0];
  const leftRun = countRunBefore(text, selection.from, character);
  const rightRun = countRunAfter(text, selection.to, character);
  return hasMarkerRun(leftRun, rightRun, marker);
};

const isWrappedInside = ({ text, selection }: EditorSnapshot, marker: string): boolean => {
  const selected = text.slice(selection.from, selection.to);
  if (selected.length < marker.length * 2) return false;
  const leftRun = countRunAfter(selected, 0, marker[0]);
  const rightRun = countRunBefore(selected, selected.length, marker[0]);
  return leftRun < selected.length && hasMarkerRun(leftRun, rightRun, marker);
};

const unwrapInside = ({ selection }: EditorSnapshot, marker: string): CommandResult => ({
  changes: [
    { from: selection.from, to: selection.from + marker.length, insert: "" },
    { from: selection.to - marker.length, to: selection.to, insert: "" },
  ],
  selection: { from: selection.from, to: selection.to - marker.length * 2 },
});

const unwrapOutside = ({ selection }: EditorSnapshot, marker: string): CommandResult => ({
  changes: [
    { from: selection.from - marker.length, to: selection.from, insert: "" },
    { from: selection.to, to: selection.to + marker.length, insert: "" },
  ],
  selection: { from: selection.from - marker.length, to: selection.to - marker.length },
});

const wrap = ({ selection }: EditorSnapshot, marker: string): CommandResult => ({
  changes: [
    { from: selection.from, to: selection.from, insert: marker },
    { from: selection.to, to: selection.to, insert: marker },
  ],
  selection: { from: selection.from + marker.length, to: selection.to + marker.length },
});

export const wrapSelection =
  (marker: string): MarkdownCommand =>
  (snapshot) => {
    if (isWrappedOutside(snapshot, marker)) return unwrapOutside(snapshot, marker);
    if (isWrappedInside(snapshot, marker)) return unwrapInside(snapshot, marker);
    return wrap(snapshot, marker);
  };
