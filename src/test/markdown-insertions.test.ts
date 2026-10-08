import { expect, test } from "vitest";
import type { EditorSnapshot } from "../components/markdown-editor/commands/command-types";
import { formatLink, insertReference, nextReferenceId, readReferenceIds } from "../components/markdown-editor/commands/insertions";
import { findUrlProblem, normalizeUrl } from "../components/markdown-editor/dialogs/url-policy";

const applyAll = (snapshot: EditorSnapshot, command: ReturnType<typeof insertReference>) => {
  const { changes } = command(snapshot);
  let offset = 0;
  return [...changes]
    .sort((first, second) => first.from - second.from)
    .reduce((text, change) => {
      const updated = text.slice(0, change.from + offset) + change.insert + text.slice(change.to + offset);
      offset += change.insert.length - (change.to - change.from);
      return updated;
    }, snapshot.text);
};

test.each([
  { link: { text: "docs", url: "https://x.dev" }, markdown: "[docs](https://x.dev)" },
  { link: { text: "", url: "https://x.dev" }, markdown: "[https://x.dev](https://x.dev)" },
  { link: { text: "a [b]", url: "/path with space" }, markdown: "[a \\[b\\]](</path with space>)" },
  { link: { text: "t", url: "https://x.dev", title: 'Say "hi"' }, markdown: '[t](https://x.dev "Say \\"hi\\"")' },
])("formats the link $markdown", ({ link, markdown }) => {
  expect(formatLink(link)).toBe(markdown);
});

test.each([
  { input: "ejemplo.com/guia", url: "https://ejemplo.com/guia", problem: null },
  { input: "  https://x.dev  ", url: "https://x.dev", problem: null },
  { input: "/mocks/table", url: "/mocks/table", problem: null },
  { input: "mailto:a@b.co", url: "mailto:a@b.co", problem: null },
  { input: "", url: "", problem: "missing" },
  { input: "javascript:alert(1)", url: "javascript:alert(1)", problem: "unsafe" },
  { input: "no es una url", url: "no es una url", problem: "invalid" },
])("normalizes and checks $input", ({ input, url, problem }) => {
  expect(normalizeUrl(input)).toBe(url);
  expect(findUrlProblem(input)).toBe(problem);
});

test("reads existing reference ids and picks the next free number", () => {
  const text = "[a][1] [^2]\n\n[1]: https://x.dev\n[^1]: note\n[^2]: other";
  expect(readReferenceIds(text, "link")).toEqual(["1"]);
  expect(readReferenceIds(text, "footnote")).toEqual(["1", "2"]);
  expect(nextReferenceId(["1", "2", "4"])).toBe("3");
});

test("inserts a footnote after the selection and its definition at the end", () => {
  const snapshot = { text: "Una frase.", selection: { from: 4, to: 9 } };
  expect(applyAll(snapshot, insertReference({ kind: "footnote", text: "", content: "La fuente" }))).toBe("Una frase[^1].\n\n[^1]: La fuente\n");
});

test("inserts a reference link with a given id", () => {
  const snapshot = { text: "Ver aquí\n", selection: { from: 9, to: 9 } };
  const reference = { kind: "link" as const, text: "manual", content: "https://x.dev/m", id: "manual" };
  expect(applyAll(snapshot, insertReference(reference))).toBe("Ver aquí\n[manual][manual]\n[manual]: https://x.dev/m\n");
});
