import { expect, test } from "vitest";

// gridory/countries is for tables and filters: it must not pull in the selectors, Radix or the icons.
const SOURCES = import.meta.glob<string>(
  ["../countries.ts", "../components/**/*.{ts,tsx}", "../lib/**/*.ts"],
  { query: "?raw", import: "default", eager: true },
);
const IMPORT_SPECIFIER = /(?:from|import)\s+["']([^"']+)["']/g;
const SOURCE_EXTENSIONS = [".ts", ".tsx", "/index.ts"];
const ENTRY = "../countries.ts";

const joinRelativePath = (file: string, specifier: string): string => {
  const parts = file.split("/").slice(0, -1);
  for (const part of specifier.split("/")) {
    if (part === "..") parts.pop();
    else if (part !== ".") parts.push(part);
  }
  return parts.join("/");
};

const resolveSource = (file: string, specifier: string): string | undefined => {
  const path = joinRelativePath(file, specifier);
  return SOURCE_EXTENSIONS.map((extension) => path + extension).find((candidate) => candidate in SOURCES);
};

const listSpecifiers = (file: string): string[] =>
  [...(SOURCES[file] ?? "").matchAll(IMPORT_SPECIFIER)].map((match) => match[1]).filter((specifier) => !specifier.endsWith(".css"));

interface ImportGraph {
  files: Set<string>;
  packages: Set<string>;
}

const visitImports = (file: string, graph: ImportGraph): void => {
  if (graph.files.has(file)) return;
  graph.files.add(file);
  for (const specifier of listSpecifiers(file)) {
    if (!specifier.startsWith(".")) graph.packages.add(specifier);
    else visitImports(resolveSource(file, specifier) ?? `missing:${specifier}`, graph);
  }
};

const collectImportGraph = () => {
  const graph: ImportGraph = { files: new Set(), packages: new Set() };
  visitImports(ENTRY, graph);
  return { files: [...graph.files], packages: [...graph.packages] };
};

test("gridory/countries only reaches the shared country code and React", () => {
  const { files, packages } = collectImportGraph();
  const outside = files.filter((file) => file !== ENTRY && !file.startsWith("../components/shared/countries/") && !file.startsWith("../lib/"));
  expect(files.length).toBeGreaterThan(3);
  expect(outside).toEqual([]);
  expect(packages.filter((name) => name !== "react")).toEqual([]);
});

test("gridory/countries exposes the catalog and not the selectors", async () => {
  const entry = await import("../countries");
  for (const name of ["CountryFlag", "getCountryName", "getDialCode", "findCountryByDialCode", "listCountries", "isCountryCode"]) {
    expect(entry).toHaveProperty(name);
  }
  expect(entry).not.toHaveProperty("CountrySelect");
  expect(entry).not.toHaveProperty("PhoneInput");
});
