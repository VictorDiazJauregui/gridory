import { PLAIN_TEXT_LANGUAGE_ID } from "../code/code-languages";
import type { CodeInsert, ImageInsert, TableAlignment, TableInsert, LinkInsert, ReferenceInsert, ReferenceKind } from "../dialogs/dialog-types";
import { insertBlock } from "./insert-block";
import type { MarkdownCommand } from "./command-types";
import { insertText } from "./insert-text";

const DEFINITION_PATTERNS: Record<ReferenceKind, RegExp> = {
  link: /^\[(?!\^)([^\]]+)\]:/gm,
  footnote: /^\[\^([^\]]+)\]:/gm,
};

const escapeLabel = (text: string): string => text.replace(/[[\]]/g, "\\$&");

const formatDestination = (url: string): string => (/[\s()<>]/.test(url) ? `<${url.replace(/>/g, "%3E")}>` : url);

const formatTitle = (title?: string): string => (title ? ` "${title.replace(/"/g, '\\"')}"` : "");

export const formatLink = ({ text, url, title }: LinkInsert): string =>
  `[${escapeLabel(text || url)}](${formatDestination(url)}${formatTitle(title)})`;

export const readReferenceIds = (text: string, kind: ReferenceKind): string[] =>
  [...text.matchAll(DEFINITION_PATTERNS[kind])].map((match) => match[1]);

export const nextReferenceId = (existingIds: readonly string[]): string => {
  let candidate = 1;
  while (existingIds.includes(String(candidate))) candidate += 1;
  return String(candidate);
};

const formatReference = (reference: ReferenceInsert, id: string) =>
  reference.kind === "footnote"
    ? { marker: `[^${id}]`, definition: `[^${id}]: ${reference.content}` }
    : { marker: `[${escapeLabel(reference.text || reference.content)}][${id}]`, definition: `[${id}]: ${formatDestination(reference.content)}` };

const separateFromDocumentEnd = (text: string): string => {
  if (text === "" || text.endsWith("\n\n")) return "";
  return text.endsWith("\n") ? "\n" : "\n\n";
};

export const insertReference =
  (reference: ReferenceInsert): MarkdownCommand =>
  (snapshot) => {
    const id = reference.id || nextReferenceId(readReferenceIds(snapshot.text, reference.kind));
    const { marker, definition } = formatReference(reference, id);
    const atSelection = reference.kind === "footnote" ? { ...snapshot.selection, from: snapshot.selection.to } : snapshot.selection;
    const separator = separateFromDocumentEnd(snapshot.text);
    const markerChange = insertText(marker)({ ...snapshot, selection: atSelection });
    return {
      changes: [...markerChange.changes, { from: snapshot.text.length, to: snapshot.text.length, insert: `${separator}${definition}\n` }],
      selection: markerChange.selection,
    };
  };

export const insertLink = (link: LinkInsert): MarkdownCommand => insertText(formatLink(link));

export const formatImage = ({ url, alt, title }: ImageInsert): string => `![${escapeLabel(alt)}](${formatDestination(url)}${formatTitle(title)})`;

export const insertImage = (image: ImageInsert): MarkdownCommand => insertText(formatImage(image));

export const replaceMarker =
  (marker: string, replacement: string): MarkdownCommand =>
  ({ text, selection }) => {
    const from = text.indexOf(marker);
    if (from === -1) return { changes: [], selection };
    const shift = (position: number) => (position > from ? position + replacement.length - marker.length : position);
    return {
      changes: [{ from, to: from + marker.length, insert: replacement }],
      selection: { from: shift(selection.from), to: shift(selection.to) },
    };
  };

const longestBacktickRun = (code: string): number => Math.max(0, ...[...code.matchAll(/`+/g)].map((run) => run[0].length));

export const formatCodeBlock = ({ language, code }: CodeInsert): string => {
  const fence = "`".repeat(Math.max(3, longestBacktickRun(code) + 1));
  const info = language === PLAIN_TEXT_LANGUAGE_ID ? "" : language;
  return `${fence}${info}\n${code.replace(/\n$/, "")}\n${fence}`;
};

export const insertCodeBlock = (block: CodeInsert): MarkdownCommand => {
  const text = formatCodeBlock(block);
  const cursor = block.code === "" ? text.indexOf("\n") + 1 : undefined;
  return insertBlock({ text, cursor });
};

const ALIGNMENT_MARKERS: Record<TableAlignment, string> = {
  left: ":---",
  center: ":---:",
  right: "---:",
};

const formatRow = (cells: readonly string[]): string => `| ${cells.join(" | ")} |`;

export const formatTable = ({ rows, columns, alignment }: TableInsert): string => {
  const emptyCells = Array.from({ length: columns }, () => "");
  return [formatRow(emptyCells), formatRow(emptyCells.map(() => ALIGNMENT_MARKERS[alignment])), ...Array.from({ length: rows }, () => formatRow(emptyCells))].join("\n");
};

export const insertTable = (table: TableInsert): MarkdownCommand => insertBlock({ text: formatTable(table), cursor: 2 });
