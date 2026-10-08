declare module "markdown-it-footnote" {
  import type { MarkdownIt } from "markdown-it";

  const footnotePlugin: (parser: MarkdownIt) => void;
  export default footnotePlugin;
}
