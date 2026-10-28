#!/usr/bin/env node
/**
 * Compiles a minimal consumer against dist/types with the strictest settings (skipLibCheck off,
 * noUncheckedSideEffectImports on), one import per entry of package.json `exports`. Runs after the build.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";

const root = process.cwd();
const tscBin = createRequire(import.meta.url).resolve("typescript/bin/tsc");

const CONSUMER_COMPILER_OPTIONS = {
  target: "ES2022",
  module: "ESNext",
  moduleResolution: "Bundler",
  jsx: "react-jsx",
  strict: true,
  noEmit: true,
  skipLibCheck: false,
  noUncheckedSideEffectImports: true,
  types: [],
};

class PublishedTypesError extends Error {
  constructor(compilerOutput) {
    super(`The published types do not compile for a strict consumer:\n${compilerOutput}`);
    this.name = "PublishedTypesError";
  }
}

const listPublicTypeEntries = () => {
  const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  return Object.values(manifest.exports)
    .map((target) => target?.types)
    .filter(Boolean)
    .map((typesPath) => path.join(root, typesPath));
};

const writeConsumer = (consumerDir, entries) => {
  const imports = entries.map((entry) => `import ${JSON.stringify(entry.replace(/\.d\.ts$/, ""))};`);
  writeFileSync(path.join(consumerDir, "consumer.ts"), `${imports.join("\n")}\n`);
  const tsconfig = { compilerOptions: CONSUMER_COMPILER_OPTIONS, files: ["consumer.ts"] };
  writeFileSync(path.join(consumerDir, "tsconfig.json"), JSON.stringify(tsconfig, null, 2));
};

const compileConsumer = (consumerDir) => {
  try {
    execFileSync(process.execPath, [tscBin, "-p", consumerDir], { encoding: "utf8" });
  } catch (error) {
    throw new PublishedTypesError(`${error.stdout ?? ""}${error.stderr ?? ""}`);
  }
};

const main = () => {
  const entries = listPublicTypeEntries();
  const consumerDir = mkdtempSync(path.join(tmpdir(), "gridory-types-"));
  try {
    writeConsumer(consumerDir, entries);
    compileConsumer(consumerDir);
  } finally {
    rmSync(consumerDir, { recursive: true, force: true });
  }
  console.log(`check-published-types: OK (${entries.length} public entries compile with skipLibCheck: false)`);
};

main();
