# Markdown editor

[English](markdown-editor.md) · [Español](markdown-editor.es.md)

`MarkdownEditor` lets people write standard Markdown (CommonMark and GFM) and see the sanitized HTML
next to it. It keeps no business state: it emits events (`onChange`, `onViewChange`,
`onEmojiSelect`…) and your app decides what to store. Everything it writes is plain Markdown that any
other viewer reads the same way: no custom syntax.

## Contents

- [Import](#import)
- [Quick example](#quick-example)
- [Views and synced scrolling](#views-and-synced-scrolling)
- [Toolbar](#toolbar)
- [Tools](#tools)
- [Dialogs](#dialogs)
- [Images](#images)
- [Outline](#outline)
- [Guide](#guide)
- [Read-only viewer](#read-only-viewer)
- [Diagrams and formulas](#diagrams-and-formulas)
- [Rendering and security](#rendering-and-security)
- [Bundle size](#bundle-size)
- [Keyboard and accessibility](#keyboard-and-accessibility)
- [Phones](#phones)
- [Styling](#styling)
- [Texts](#texts)
- [Reference](#reference)

## Import

```ts
import { MarkdownEditor, MarkdownViewer } from "gridory/markdown-editor";
```

Import `gridory/styles.css` once in your app, before any override (see [theming.md](theming.md)). The
root `gridory` entry re-exports the same names. Two optional entries add drawing on demand:
`gridory/markdown-editor/mermaid` and `gridory/markdown-editor/katex` (see
[Diagrams and formulas](#diagrams-and-formulas)).

## Quick example

```tsx
import { useState } from "react";
import { MarkdownEditor } from "gridory/markdown-editor";

export const NoteEditor = () => {
  const [markdown, setMarkdown] = useState("# Meeting notes\n\n- [ ] Send the summary");
  return <MarkdownEditor value={markdown} onChange={setMarkdown} />;
};
```

Leave `value` out and pass `defaultValue` for an uncontrolled editor. `onChange` receives the whole
Markdown on every edit, typed or applied by a tool.

## Views and synced scrolling

| Prop | Default | What it does |
|---|---|---|
| `view` / `defaultView` | `"split"` | `"split"` (both panels), `"source"` (only the editor) or `"preview"` (only the result). |
| `onViewChange` | — | Fires when the view switch changes the view. |
| `views` | `["source", "split", "preview"]` | Views the switch offers, in order. With one view, the switch hides itself. |
| `syncScroll` | `true` | In the split view, scrolling one panel scrolls the other to the same block. |

The sync maps source lines to preview blocks, so images, tables, code, diagrams and formulas stay
aligned even when their heights differ between the two panels. Blocks drawn on demand (diagrams,
formulas) realign the panels when they finish drawing.

## Toolbar

`toolbarPlacement` decides where `MarkdownEditor` puts its toolbar:

| Value | Where |
|---|---|
| `"shared"` (default) | Above both panels, next to the view switch. |
| `"source"` | Above the writing area only. |
| `"none"` | Nowhere: compose it yourself with `MarkdownToolbar`. |

For a free layout, use the parts inside `MarkdownEditorProvider`:

```tsx
import { MarkdownEditorProvider, MarkdownPanels, MarkdownToolbar, MarkdownViewSwitch } from "gridory/markdown-editor";

<MarkdownEditorProvider value={markdown} onChange={setMarkdown}>
  <header className="note-header">
    <h2>Customer note</h2>
    <MarkdownToolbar />
    <MarkdownViewSwitch />
  </header>
  <MarkdownPanels />
</MarkdownEditorProvider>;
```

`MarkdownSource`, `MarkdownPreview` and `MarkdownOutline` are also available on their own, and
`useMarkdownEditor()` gives any part rendered inside the provider the value, the view and the actions
(`apply`, `undo`, `openDialog`…). Tools that do not fit fold into a "⋯" menu, measured on every
resize.

## Tools

`tools` takes a preset (`"full"`, `"simple"`, `"minimal"`) or a list of tool ids and tool objects,
with `"|"` between groups. `MARKDOWN_TOOLBAR_PRESETS` holds the presets and `MARKDOWN_TOOL_IDS` every
built-in id.

| Id | Writes or does | Shortcut |
|---|---|---|
| `undo`, `redo` | Undo and redo; every tool is one undoable step | `Mod+Z`, `Mod+Shift+Z` |
| `bold`, `italic`, `strikethrough`, `inlineCode` | `**…**`, `*…*`, `~~…~~`, `` `…` `` (toggle) | `Mod+B`, `Mod+I`, `Mod+Shift+X`, `Mod+E` |
| `uppercase`, `lowercase`, `capitalize` | Change the case of the selection | — |
| `heading` | Menu with H1 to H6 | — |
| `quote`, `bulletList`, `orderedList`, `taskList` | `> `, `- `, `1. `, `- [ ] ` per line (toggle) | — |
| `horizontalRule` | `---` | — |
| `alert` | GitHub alerts: `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` | — |
| `link`, `reference`, `image`, `codeBlock`, `table` | Open their dialogs | `Mod+K` (link) |
| `diagram`, `formula` | Diagram dialog, `$…$` / `$$…$$` | — (shown only when set up) |
| `emoji`, `htmlEntity` | Emoji picker and HTML entity picker | — |
| `dateTime` | Current date and time, formatted with `locale` or `formatDateTime` | — |
| `search`, `replace`, `goToLine` | Search panel | `Mod+F`, `Mod+H`, `Mod+G` |
| `outline` | Opens and closes the [outline](#outline) | — |
| `fullscreen` | Covers the page; `Escape` leaves | — |
| `clear` | Empties the document after a confirmation; undoable | — |
| `guide` | Opens the [syntax guide](#guide) | — |

`Mod` is ⌘ on macOS and Ctrl elsewhere. A tool of your own is an object:

```tsx
import { insertText, MarkdownEditor, type MarkdownTool } from "gridory/markdown-editor";
import { PenLine } from "lucide-react";

const SIGNATURE_TOOL: MarkdownTool = {
  id: "signature",
  label: "Signature",
  icon: PenLine,
  shortcut: "Mod-Shift-f",
  run: ({ editor }) => editor.apply(insertText("\n\n— Support team")),
};

<MarkdownEditor tools={["bold", "italic", "|", "link", "|", SIGNATURE_TOOL]} />;
```

Commands are pure functions of the text and the selection (`wrapSelection`, `prefixLines`,
`insertBlock`, `insertText`, `transformCase`, `markdownCommands`…), so a tool can reuse them and a
test can check them without a browser. An unknown id throws `UnknownMarkdownToolError`.

## Dialogs

Links, references, images, code blocks, tables, emoji, symbols, diagrams and the guide open in
dialogs. Each one only returns data; the editor writes the Markdown. Replace any of them through
`dialogs`: your component gets the same props (`open`, `onOpenChange`, `onInsert`, `selectedText`
and the extra ones of that dialog) and `MarkdownDialogFrame` gives it the built-in frame.

```tsx
import { useId, useState, type FormEvent } from "react";
import { MarkdownDialogFrame, MarkdownEditor, type LinkInsert, type MarkdownDialogProps } from "gridory/markdown-editor";

const PAGES = [{ label: "Pricing", url: "/pricing" }, { label: "Contact", url: "/contact" }];

const InternalPageDialog = ({ open, onOpenChange, onInsert, selectedText }: MarkdownDialogProps<LinkInsert>) => {
  const formId = useId();
  const [url, setUrl] = useState(PAGES[0].url);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const page = PAGES.find((candidate) => candidate.url === url) ?? PAGES[0];
    onInsert({ text: selectedText || page.label, url: page.url });
  };
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title="Link a page" formId={formId} submitLabel="Link">
      <form id={formId} onSubmit={submit}>
        {PAGES.map((page) => (
          <label key={page.url}>
            <input type="radio" name="page" checked={url === page.url} onChange={() => setUrl(page.url)} /> {page.label}
          </label>
        ))}
      </form>
    </MarkdownDialogFrame>
  );
};

<MarkdownEditor dialogs={{ link: InternalPageDialog }} />;
```

| Key of `dialogs` | Props besides `open` and `onOpenChange` |
|---|---|
| `link` | `onInsert(LinkInsert)`, `selectedText` |
| `reference` | `onInsert(ReferenceInsert)`, `selectedText`, `existingIds` |
| `image` | `onInsert(ImageInsert)`, `selectedText`, `uploadImage`, `uploadRules` |
| `code` | `onInsert(CodeInsert)`, `selectedText`, `languages` |
| `table` | `onInsert(TableInsert)`, `selectedText`, `limits` |
| `emoji` | `onInsert(SymbolInsert)`, `selectedText`, `recentEmojis` |
| `htmlEntity` | `onInsert(SymbolInsert)`, `selectedText` |
| `diagram` | `onInsert(DiagramInsert)`, `selectedText`, `templates`, `diagrams` |
| `guide` | `sections`, `tools` |

The built-in dialogs are exported too (`LinkDialog`, `ImageDialog`, `CodeDialog`, `TableDialog`,
`EmojiDialog`, `HtmlEntityDialog`, `DiagramDialog`, `GuideDialog`…) to wrap them. When a dialog
closes, the focus goes back to the button that opened it, or to the writing area when a shortcut
did. `limits` caps the table dialog (`{ tableRows: 20, tableColumns: 10 }` by default) and
`codeLanguages` lists the languages of the code dialog and the preview's coloring
(`DEFAULT_CODE_LANGUAGES`, 21 languages loaded on demand).

The emoji picker downloads its catalog only when it opens, searches in Spanish and English, keeps the
recent ones in memory and calls `onEmojiSelect` so your app can store them.

## Images

Without `onImageUpload`, images come from URLs. With it, the image dialog also accepts files, and
pasting or dropping an image on the writing area uploads it:

```tsx
<MarkdownEditor
  onImageUpload={async (file) => ({ url: await uploadToStorage(file), alt: file.name })}
  acceptedImageTypes={["image/png", "image/jpeg"]}
  maxImageBytes={2 * 1024 * 1024}
/>
```

While a pasted or dropped image uploads, the document shows a placeholder that the final URL
replaces. A rejected promise shows its message and removes the placeholder. Files outside
`acceptedImageTypes` or above `maxImageBytes` (5 MB by default) are refused before uploading.

## Outline

The `outline` tool opens a side panel with the document's headings as a tree, built with the same
ids the preview gives them, without writing any marker into the document. A click or `Enter` takes
both panels to the heading, and the panel marks the heading in view while scrolling. Control it with
`showOutline`, `defaultShowOutline` and `onOutlineChange`. `readMarkdownHeadings(markdown)` returns
the same list for your own index.

## Guide

The `guide` tool opens the syntax guide, with two tabs (Write and Insert). Each section shows the
Markdown, its rendered result and the icons and shortcuts of the tools that write it. It follows the
toolbar: a section shows only while one of its tools is in the toolbar, so removing a tool, or not
setting up diagrams or formulas, removes its section.

```tsx
<MarkdownEditor
  guide={{
    sections: (defaults) => [
      ...defaults.filter((section) => section.id !== "html-entities"),
      { id: "signature", tab: "write", title: "Signature", description: "Close every note.", examples: ["— *Support team*"], toolIds: [] },
    ],
  }}
/>
```

`guide={false}` removes the button, `DEFAULT_GUIDE_SECTIONS` holds the built-in sections and
`dialogs.guide` replaces the frame. A section with no `toolIds` always shows.

## Read-only viewer

`MarkdownViewer` renders saved Markdown exactly as the preview does, without loading the editor
(CodeMirror stays out of its bundle):

```tsx
import { MarkdownViewer } from "gridory/markdown-editor";

<MarkdownViewer value={note.body} aria-label="Note" />;
```

It takes `renderOptions`, `codeLanguages`, `diagrams` and `formulas` like the editor. For HTML
outside React, `renderMarkdown(markdown, options)` returns the same sanitized string.

## Diagrams and formulas

Both are optional, cost nothing until a document uses them, and need their package installed by
your app:

```bash
npm install mermaid katex
```

```tsx
import { MarkdownEditor, MarkdownViewer } from "gridory/markdown-editor";
import { mermaidDiagrams } from "gridory/markdown-editor/mermaid";
import { katexFormulas } from "gridory/markdown-editor/katex";

<MarkdownEditor diagrams={mermaidDiagrams} formulas={katexFormulas} />;
<MarkdownViewer value={report} diagrams={mermaidDiagrams} formulas={katexFormulas} />;
```

Only those two entries name the packages, so an app that does not import them never compiles them.

**Diagrams.** ` ```mermaid ` blocks (flowcharts, sequence, Gantt, classes, states, ER, pie…) are
drawn when the first one shows up. Mermaid runs with `securityLevel: "strict"`, labels in plain SVG
and the SVG goes through DOMPurify without `foreignObject` or scripts. While a diagram draws, its
block keeps its place; a syntax error shows inside the block, with the code below. Drawn diagrams are
cached by content, so typing elsewhere does not redraw them, and new ones wait for a pause in typing.
Colors come from the tokens (`--gdy-md-diagram-*`) and redraw when the theme changes. In a Gantt
chart, task labels always take the text color, the active task is tinted with
`--gdy-md-diagram-active` and the axis reads `dd/mm` unless the diagram sets its own `axisFormat`.
A wide diagram shrinks to the panel and opens at full size from its button. The `diagram` tool opens
a dialog with seven templates (`DEFAULT_DIAGRAM_TEMPLATES`, replaceable with `diagramTemplates`) and a live
preview. Without `diagrams`, the blocks show as code and the tool hides.

**Formulas.** `$…$` inline and `$$…$$` as a block (also inline), plus ` ```math ` blocks, the same
syntax GitHub reads. An amount such as "$5 and $10" stays text: a closing `$` cannot follow a space
or precede a digit, and `\$` is a literal dollar. KaTeX and its stylesheet load with the first
formula. A formula that does not parse stays as TeX, underlined, with KaTeX's message (below a
block). The `formula` tool wraps the selection in `$…$` or opens a `$$` block. Without `formulas`,
the dollars show as written and the tool hides.

## Rendering and security

- CommonMark and GFM: tables, strikethrough, task lists, autolinks, footnotes and GitHub alerts.
- Raw HTML is off by default; `renderOptions.allowHtml` lets it through, always sanitized with
  DOMPurify.
- Links accept `http`, `https`, `mailto`, `tel` and relative paths; `javascript:` and `data:`
  (except images) stay inert. External links open in a new tab with `rel="noopener noreferrer"`
  (`openExternalLinksInNewTab: false` to turn it off).
- Headings get stable ids for anchors; `renderOptions.idPrefix` keeps them unique when several
  documents share a page.
- Images load lazily and wide tables scroll inside their own box.
- The preview renders a deferred copy of the value, so typing stays fluid in long documents.

`renderOptions` also takes `breaks` and `typographer` (both off by default) and `texts` for the
rendered texts (alert titles, footnotes, diagram and formula messages).

## Bundle size

Measured with esbuild (minified, gzip, React excluded) on the published build:

| What | When it downloads | gzip |
|---|---|---|
| `MarkdownViewer` alone (markdown-it, DOMPurify) | Always, with the viewer | ≈ 65 KB |
| `MarkdownEditor` (adds Radix parts, toolbar, dialogs) | Always, with the editor | ≈ 120 KB |
| CodeMirror (writing area) | When the writing area mounts | ≈ 108 KB |
| highlight.js core | First code block with a known language | ≈ 8 KB |
| Each highlighted language | First block of that language | 1–5 KB |
| Emoji catalog | When the emoji picker opens | ≈ 5 KB |
| Mermaid | First diagram (only with `mermaidDiagrams`) | ≈ 170 KB, plus 10–50 KB per diagram type |
| KaTeX and its stylesheet | First formula (only with `katexFormulas`) | ≈ 75 KB, plus fonts |

## Keyboard and accessibility

- The writing area is a labeled text box (`texts.sourceLabel`) and the preview a named region
  (`texts.previewLabel`).
- The toolbar is a single tab stop with arrow keys between buttons; every button has a name and a
  tooltip with its shortcut, and toggles expose `aria-pressed`.
- Dialogs trap the focus, close with `Escape` and give the focus back.
- Pickers move with the arrow keys; every option has an accessible name.
- Alerts and code colors meet WCAG AA contrast in light and dark themes (checked by a browser test).

## Phones

Below 768 px of editor width, the split view shows one panel at a time: the view switch becomes the
Editor and Preview tabs (this does not change `view` nor fire `onViewChange`), almost the whole
toolbar folds into "⋯" and the page never scrolls sideways. It is checked on iPhone 14 Pro and Pixel
7 sizes.

## Styling

The module follows the library rules: classes `gdy-md-*`, states in `data-*` attributes
(`data-view`, `data-fullscreen`, `data-variant`…) and every value behind a `--gdy-md-*` token with a
fallback to a base token, in light and dark. The full token table is in
[theming.md](theming.md#markdown-editor-tokens) and every class in
[style-hooks.md](style-hooks.md#markdown-editor). Dialogs render in a portal under `<body>`: declare
the tokens that style them on `:root` or `.dark`.

```css
.reports-page {
  --gdy-md-editor-height: 40rem;
  --gdy-md-preview-font-family: Georgia, serif;
  --gdy-md-divider: var(--gdy-primary);
  --gdy-md-scrollbar-size: 6px;
}
```

## Texts

Every text is in Spanish by default and replaceable through `texts` (editor, toolbar, dialogs,
search panel, outline) and `renderOptions.texts` (what the preview renders). Partial objects merge
with the defaults (`DEFAULT_MARKDOWN_EDITOR_TEXTS`, `DEFAULT_MARKDOWN_RENDER_TEXTS`):

```tsx
<MarkdownEditor
  texts={{ placeholder: "Write here…", tools: { bold: "Bold" }, dialogs: { link: { title: "Insert link" } } }}
  renderOptions={{ texts: { alertTitles: { warning: "Careful" } } }}
/>
```

## Reference

`MarkdownEditor` takes every `MarkdownEditorProvider` prop plus `syncScroll`, `toolbarPlacement` and
`className`.

| Prop | Type | Default |
|---|---|---|
| `value` / `defaultValue` / `onChange` | `string` / `string` / `(value) => void` | `""` |
| `view` / `defaultView` / `onViewChange` / `views` | see [Views](#views-and-synced-scrolling) | `"split"` |
| `tools` | `MarkdownToolbarConfig` | `"full"` |
| `renderOptions` | `MarkdownRenderOptions` | — |
| `codeLanguages` | `readonly MarkdownCodeLanguage[]` | `DEFAULT_CODE_LANGUAGES` |
| `limits` | `Partial<MarkdownEditorLimits>` | 20 rows × 10 columns |
| `onImageUpload` / `acceptedImageTypes` / `maxImageBytes` | see [Images](#images) | URLs only |
| `dialogs` | `Partial<MarkdownDialogComponents>` | built-in |
| `diagrams` / `diagramTemplates` | `MarkdownDiagramRenderer` / templates | off |
| `formulas` | `MarkdownFormulaRenderer` | off |
| `guide` | `false \| MarkdownGuideConfig` | built-in sections |
| `showOutline` / `defaultShowOutline` / `onOutlineChange` | outline panel | closed |
| `onFullscreenChange` | `(fullscreen) => void` | — |
| `onEmojiSelect` | `(emoji) => void` | — |
| `locale` / `formatDateTime` | date tool | browser locale |
| `texts` | partial `MarkdownEditorTexts` | Spanish |
| `syncScroll` | `boolean` | `true` |
| `toolbarPlacement` | `"shared" \| "source" \| "none"` | `"shared"` |

Errors: `MissingMarkdownEditorProviderError` (a part rendered outside the provider),
`UnknownMarkdownToolError` (an unknown tool id) and `MarkdownSanitizerUnavailableError`
(`renderMarkdown` called outside the browser: it sanitizes with the DOM).
