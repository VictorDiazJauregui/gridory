import { readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = import.meta.dirname;

type PackageManifest = {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const manifest = JSON.parse(
  readFileSync(path.join(rootDir, "package.json"), "utf8"),
) as PackageManifest;

// Every dependency and peer dependency stays out of the bundle so the consumer installs a single copy of each;
// the prefix check also covers subpath imports such as "react/jsx-runtime" or "date-fns/locale".
const externalPackages = [
  ...Object.keys(manifest.dependencies ?? {}),
  ...Object.keys(manifest.peerDependencies ?? {}),
];

const isExternal = (id: string): boolean =>
  externalPackages.some((name) => id === name || id.startsWith(`${name}/`));

// Opt-in stylesheets ship next to gridory.css, untouched, and no entry imports them:
// a consumer adds them on purpose (see docs/theming.md).
const OPTIONAL_STYLESHEETS = ["tokens-hsl-channels.css"];

const emitOptionalStylesheets = (): Plugin => ({
  name: "gridory-optional-stylesheets",
  apply: "build",
  generateBundle() {
    for (const fileName of OPTIONAL_STYLESHEETS) {
      const source = readFileSync(path.join(rootDir, "src/styles", fileName), "utf8");
      this.emitFile({ type: "asset", fileName, source });
    }
  },
});

export default defineConfig({
  plugins: [react(), emitOptionalStylesheets()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/google-openai": {
        target: "https://generativelanguage.googleapis.com/v1beta/openai",
        changeOrigin: true,
        secure: true,
        rewrite: (currentPath) =>
          currentPath.replace(/^\/api\/google-openai/, ""),
      },
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(rootDir, "src/index.ts"),
        table: path.resolve(rootDir, "src/table.ts"),
        kanban: path.resolve(rootDir, "src/kanban.ts"),
        ai: path.resolve(rootDir, "src/ai.ts"),
        auth: path.resolve(rootDir, "src/auth.ts"),
        "segmented-control": path.resolve(rootDir, "src/segmented-control.ts"),
        "country-select": path.resolve(rootDir, "src/country-select.ts"),
        "phone-input": path.resolve(rootDir, "src/phone-input.ts"),
        sidebar: path.resolve(rootDir, "src/sidebar.ts"),
        "markdown-editor": path.resolve(rootDir, "src/markdown-editor.ts"),
        "markdown-editor-mermaid": path.resolve(rootDir, "src/markdown-editor-mermaid.ts"),
        "markdown-editor-katex": path.resolve(rootDir, "src/markdown-editor-katex.ts"),
      },
      formats: ["es"],
      cssFileName: "gridory",
    },
    rollupOptions: {
      external: isExternal,
    },
    // public/ only holds demo assets (favicon); keep them out of the package.
    copyPublicDir: false,
    sourcemap: true,
    emptyOutDir: true,
  },
});
