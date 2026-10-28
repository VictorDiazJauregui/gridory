import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import ts from "typescript";
import { expect, test } from "vitest";

// Every visible text of the table and the kanban goes through `labels`: this walks the files they import and
// fails on a JSX text, text attribute or `??` fallback in the code. Only the label defaults hold Spanish texts.
const COMPONENTS = resolve(__dirname, "../components");
const ENTRY_FILES = ["table/index.tsx", "kanban/index.tsx"].map((file) => join(COMPONENTS, file));
const LABEL_FILES = new Set(["shared/labels/data-view-labels.ts", "table/labels.ts", "kanban/labels.ts"]);
const TEXT_ATTRIBUTES = new Set(["aria-label", "ariaLabel", "title", "placeholder", "label", "alt"]);
const HAS_WORD = /\p{L}{2,}/u;
// A `??` fallback is a text when it reads like one; lowercase ids ("bottom", "gt") are values.
const READS_AS_TEXT = /[\p{Lu}\s]|[^\p{ASCII}]/u;
const SOURCE_EXTENSIONS = [".tsx", ".ts", "/index.tsx", "/index.ts"];

const resolveImport = (fromFile: string, specifier: string) => {
  const base = resolve(dirname(fromFile), specifier);
  const candidates = [base, ...SOURCE_EXTENSIONS.map((extension) => `${base}${extension}`)];
  return candidates.find((candidate) => /\.tsx?$/.test(candidate) && existsSync(candidate));
};

const parse = (file: string) =>
  ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);

const listLocalImports = (source: ts.SourceFile) =>
  source.statements
    .filter((node) => ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
    .map((node) => (node as ts.ImportDeclaration).moduleSpecifier)
    .filter((specifier): specifier is ts.StringLiteral => Boolean(specifier) && ts.isStringLiteral(specifier!))
    .map((specifier) => specifier.text)
    .filter((specifier) => specifier.startsWith("."));

const collectComponentFiles = () => {
  const pending = [...ENTRY_FILES];
  const seen = new Set<string>();
  while (pending.length > 0) {
    const file = pending.pop() as string;
    if (seen.has(file) || !file.startsWith(COMPONENTS)) continue;
    seen.add(file);
    const imports = listLocalImports(parse(file)).map((specifier) => resolveImport(file, specifier));
    pending.push(...imports.filter((next): next is string => Boolean(next)));
  }
  return [...seen];
};

const isTextLiteral = (node: ts.Node) =>
  (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && HAS_WORD.test(node.text);

const isHardcodedText = (node: ts.Node) => {
  if (ts.isJsxText(node)) return HAS_WORD.test(node.text);
  if (!isTextLiteral(node)) return false;
  const parent = node.parent;
  if (ts.isJsxAttribute(parent)) return TEXT_ATTRIBUTES.has(parent.name.getText());
  const isFallback = ts.isBinaryExpression(parent) && parent.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken;
  return isFallback && READS_AS_TEXT.test((node as ts.StringLiteral).text);
};

const findHardcodedTexts = (file: string) => {
  const source = parse(file);
  const found: string[] = [];
  const visit = (node: ts.Node) => {
    if (isHardcodedText(node)) found.push(`${relative(COMPONENTS, file)}: ${node.getText().trim()}`);
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
};

test("the table and the kanban write no visible text outside their labels", () => {
  const files = collectComponentFiles().filter((file) => !LABEL_FILES.has(relative(COMPONENTS, file)));
  expect(files.length).toBeGreaterThan(50);
  expect(files.flatMap(findHardcodedTexts)).toEqual([]);
});

test("the scan catches a text written in JSX, in a text attribute or as a fallback", () => {
  const sample = ts.createSourceFile(
    "sample.tsx",
    'const a = <p title="Hola">Texto</p>; const b = props.label ?? "Opciones";',
    ts.ScriptTarget.Latest,
    true,
  );
  const found: string[] = [];
  const visit = (node: ts.Node) => {
    if (isHardcodedText(node)) found.push(node.getText());
    ts.forEachChild(node, visit);
  };
  visit(sample);
  expect(found).toEqual(['"Hola"', "Texto", '"Opciones"']);
});
