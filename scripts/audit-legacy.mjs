#!/usr/bin/env node
/**
 * Style contract audit (part 1): fails when
 *  - a legacy prefix (rdt-, rkb-, lui-) or the former product name shows up in
 *    the sources, the built package or the guides;
 *  - a literal color is written outside src/styles/tokens.css;
 *  - a component token (--gdy-<component>-*) is consumed without a fallback.
 *
 * Run through `npm run audit:styles` after `npm run build`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const walk = (dir, accept) => {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === "releases") continue;
      out.push(...walk(full, accept));
    } else if (accept(full)) {
      out.push(full);
    }
  }
  return out;
};

const rel = (file) => path.relative(root, file);
const hasExt = (...exts) => (file) => exts.includes(path.extname(file));

// 1. Legacy names --------------------------------------------------------------
const LEGACY = /\b(?:rdt|rkb|lui)-|lumini/i;
const legacyFiles = [
  ...walk(path.join(root, "src"), hasExt(".ts", ".tsx", ".css", ".md")),
  ...walk(path.join(root, "dist"), hasExt(".js", ".css", ".d.ts")),
  ...walk(path.join(root, "docs"), hasExt(".md")),
  path.join(root, "README.md"),
  path.join(root, "tailwind-preset.js"),
].filter(existsSync);

for (const file of legacyFiles) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    const match = line.match(LEGACY);
    if (match) failures.push(`${rel(file)}:${index + 1}: legacy name "${match[0]}"`);
  });
}

// 2. Literal colors only in tokens.css ------------------------------------------
const libraryCss = [
  ...walk(path.join(root, "src/styles"), hasExt(".css")),
  ...walk(path.join(root, "src/components"), hasExt(".css")),
];
const LITERAL_COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/i;

for (const file of libraryCss) {
  if (path.basename(file) === "tokens.css") continue;
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      const match = line.match(LITERAL_COLOR);
      if (match) failures.push(`${rel(file)}:${index + 1}: literal color "${match[0]}" (declare a token instead)`);
    });
}

// 3. Component tokens always carry a fallback ----------------------------------
const tokensSource = readFileSync(path.join(root, "src/styles/tokens.css"), "utf8");
const baseTokens = new Set(
  [...tokensSource.matchAll(/^\s*(--gdy-[a-z0-9-]+)\s*:/gm)].map((match) => match[1]),
);
const consumers = [
  ...libraryCss,
  ...walk(path.join(root, "src/components"), hasExt(".ts", ".tsx")),
];
const VAR_USE = /var\(\s*(--gdy-[a-z0-9-]+)\s*([,)])/g;

for (const file of consumers) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      for (const match of line.matchAll(VAR_USE)) {
        const [, name, next] = match;
        if (next === ")" && !baseTokens.has(name)) {
          failures.push(`${rel(file)}:${index + 1}: ${name} is a component token and needs a fallback`);
        }
      }
    });
}

// Report -----------------------------------------------------------------------
if (failures.length > 0) {
  console.error(`audit-legacy: ${failures.length} problem(s)\n` + failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log(
  `audit-legacy: OK (${legacyFiles.length} files free of legacy names, ${libraryCss.length} stylesheets without literal colors, ${baseTokens.size} base tokens)`,
);
