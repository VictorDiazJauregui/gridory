import { describe, expect, test } from "vitest";
import {
  hasCssImport,
  stripCssImports,
} from "../../scripts/strip-declaration-css-imports.mjs";

const TABLE_ENTRY = [
  'import "./styles/index.css";',
  'export { DataTable } from "./components/table";',
  "",
].join("\n");

describe("stripCssImports removes", () => {
  test("the side-effect CSS import of a published entry", () => {
    expect(stripCssImports(TABLE_ENTRY)).toBe('export { DataTable } from "./components/table";\n');
  });

  test("single and double quoted imports, with and without semicolon", () => {
    const source = "import './a.css';\nimport \"./b.css\"\nexport {};\n";
    expect(stripCssImports(source)).toBe("export {};\n");
  });

  test("a CSS import on the last line without a trailing newline", () => {
    expect(stripCssImports('export {};\nimport "./styles.css";')).toBe("export {};\n");
  });
});

describe("stripCssImports keeps", () => {
  test("a declaration without CSS untouched", () => {
    const source = 'import type { ReactNode } from "react";\nexport declare const x: ReactNode;\n';
    expect(stripCssImports(source)).toBe(source);
  });

  test("named, type and non-CSS imports", () => {
    const source = [
      'import { theme } from "./theme.css.js";',
      'import type { Styles } from "./styles";',
      'import "./polyfill";',
      "",
    ].join("\n");
    expect(stripCssImports(source)).toBe(source);
  });
});

describe("hasCssImport", () => {
  test("detects a CSS import before stripping and none after", () => {
    expect(hasCssImport(TABLE_ENTRY)).toBe(true);
    expect(hasCssImport(stripCssImports(TABLE_ENTRY))).toBe(false);
  });

  test("flags the CSS references the stripping step does not remove", () => {
    expect(hasCssImport('import styles from "./a.css";')).toBe(true);
    expect(hasCssImport('  import "./indented.css";')).toBe(true);
    expect(hasCssImport('export * from "./b.css";')).toBe(true);
    expect(hasCssImport('import { theme } from "./theme.css.js";')).toBe(false);
  });
});
