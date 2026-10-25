import { expect, test } from "vitest";
import { renderMarkdown } from "../components/markdown-editor/render/render-markdown";

const toDocument = (html: string): HTMLElement => {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container;
};

const renderToDocument = (markdown: string, options = {}) => toDocument(renderMarkdown(markdown, options));

test("renders emphasis, strikethrough and inline code", () => {
  const html = renderMarkdown("**bold** *italic* ~~gone~~ `code`");
  expect(html).toContain("<strong>bold</strong>");
  expect(html).toContain("<em>italic</em>");
  expect(html).toContain("<s>gone</s>");
  expect(html).toContain("<code>code</code>");
});

test("renders a table with its alignment inside a scroll wrapper", () => {
  const root = renderToDocument("| a | b | c |\n| :-- | :-: | --: |\n| 1 | 2 | 3 |");
  const headers = [...root.querySelectorAll(".gdy-md-table-scroll > table th")];
  expect(headers.map((header) => header.getAttribute("style"))).toEqual([
    "text-align:left",
    "text-align:center",
    "text-align:right",
  ]);
});

test("links bare URLs", () => {
  expect(renderToDocument("see https://example.com").querySelector("a")?.getAttribute("href")).toBe("https://example.com");
});

test("renders task list items with disabled checkboxes", () => {
  const items = [...renderToDocument("- [x] done\n- [ ] pending\n- plain").querySelectorAll("li")];
  expect(items.map((item) => item.classList.contains("gdy-md-task-item"))).toEqual([true, true, false]);
  expect(items.map((item) => item.querySelector("input")?.checked)).toEqual([true, false, undefined]);
  expect(items[0].querySelector("input")?.disabled).toBe(true);
  expect(items[0].textContent?.trim()).toBe("done");
});

test("renders reference links and footnotes with prefixed ids", () => {
  const root = renderToDocument("A [manual][m] and a claim[^1].\n\n[m]: https://example.com/m\n\n[^1]: The source.", { idPrefix: "doc" });
  expect(root.querySelector('a[href="https://example.com/m"]')?.textContent).toBe("manual");
  const reference = root.querySelector(".gdy-md-footnote-ref a");
  expect(reference?.getAttribute("href")).toBe("#fn-doc-1");
  expect(root.querySelector("#fn-doc-1")?.textContent).toContain("The source.");
  expect(root.querySelector(".gdy-md-footnotes")?.getAttribute("aria-label")).toBe("Notas al pie");
  expect(root.querySelector(".gdy-md-footnote-backref")?.getAttribute("href")).toBe(`#${reference?.id}`);
});

test.each([
  ["NOTE", "info", "Nota"],
  ["TIP", "success", "Consejo"],
  ["IMPORTANT", "important", "Importante"],
  ["WARNING", "warning", "Advertencia"],
  ["CAUTION", "error", "Precaución"],
])("renders [!%s] as a %s note with its title", (marker, variant, title) => {
  const alert = renderToDocument(`> [!${marker}]\n> Body text.`).querySelector("blockquote");
  expect(alert?.getAttribute("data-variant")).toBe(variant);
  expect(alert?.getAttribute("role")).toBe("note");
  expect(alert?.querySelector(".gdy-md-alert-title")?.textContent).toBe(title);
  expect(alert?.textContent).not.toContain(`[!${marker}]`);
  expect(alert?.textContent).toContain("Body text.");
});

test("keeps a plain blockquote untouched", () => {
  const quote = renderToDocument("> Just a quote").querySelector("blockquote");
  expect(quote?.hasAttribute("data-variant")).toBe(false);
});

test("uses replaced titles", () => {
  const root = renderToDocument("> [!NOTE]\n> x", { texts: { alertTitles: { info: "Note" } } });
  expect(root.querySelector(".gdy-md-alert-title")?.textContent).toBe("Note");
});

test("marks every top-level block with its 1-based source line", () => {
  const root = renderToDocument("# Title\n\nParagraph\n\n- item\n\n```js\ncode\n```");
  const lines = [...root.children].map((element) => element.getAttribute("data-source-line"));
  expect(lines).toEqual(["1", "3", "5", "7"]);
  expect(root.querySelector("pre")?.getAttribute("data-language")).toBe("js");
});

test("gives headings unique slug ids", () => {
  const ids = [...renderToDocument("# Año fiscal\n## Año fiscal\n### `code` & más").querySelectorAll("h1, h2, h3")].map(
    (heading) => heading.id,
  );
  expect(ids).toEqual(["año-fiscal", "año-fiscal-1", "code-más"]);
});

test.each(["javascript:alert(1)", "JaVaScRiPt:alert(1)", "vbscript:msgbox(1)", "data:text/html,<script>alert(1)</script>"])(
  "leaves a %s link inert",
  (url) => {
    const root = renderToDocument(`[click](${url})`);
    expect(root.querySelector("a")).toBeNull();
  },
);

test("escapes raw HTML by default", () => {
  const root = renderToDocument("<script>alert(1)</script><img src=x onerror=alert(1)>");
  expect(root.querySelector("script, img")).toBeNull();
  expect(root.textContent).toContain("<script>alert(1)</script>");
});

test("sanitizes raw HTML when it is allowed", () => {
  const root = renderToDocument('<img src="/a.png" onerror="alert(1)"><script>alert(1)</script><b>ok</b>', { allowHtml: true });
  expect(root.querySelector("script")).toBeNull();
  expect(root.querySelector("img")?.hasAttribute("onerror")).toBe(false);
  expect(root.querySelector("b")?.textContent).toBe("ok");
});

test("allows safe schemes, relative links and image data URLs", () => {
  const root = renderToDocument("[a](https://x.dev) [b](/path) [c](mailto:a@b.co) [d](tel:+1) ![e](data:image/png;base64,AAAA)");
  expect([...root.querySelectorAll("a")].map((link) => link.getAttribute("href"))).toEqual([
    "https://x.dev",
    "/path",
    "mailto:a@b.co",
    "tel:+1",
  ]);
  expect(root.querySelector("img")?.getAttribute("src")).toBe("data:image/png;base64,AAAA");
});

test("opens external links in an isolated new tab, unless turned off", () => {
  const link = renderToDocument("[x](https://x.dev) [y](/local)").querySelectorAll("a");
  expect([link[0].target, link[0].rel]).toEqual(["_blank", "noopener noreferrer"]);
  expect(link[1].hasAttribute("target")).toBe(false);
  const sameTab = renderToDocument("[x](https://x.dev)", { openExternalLinksInNewTab: false }).querySelector("a");
  expect(sameTab?.hasAttribute("target")).toBe(false);
});

test("lazy-loads images", () => {
  expect(renderToDocument("![alt](/a.png)").querySelector("img")?.getAttribute("loading")).toBe("lazy");
});

test("keeps CommonMark line breaks and plain quotes by default", () => {
  const html = renderMarkdown('one\ntwo "quoted" -- dash');
  expect(html).not.toContain("<br>");
  expect(html).toContain('"quoted" -- dash');
});

test("turns on breaks and typographer", () => {
  const html = renderMarkdown('one\ntwo "quoted" -- dash', { breaks: true, typographer: true });
  expect(html).toContain("<br>");
  expect(html).toContain("“quoted” – dash");
});
