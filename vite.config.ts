import { readFileSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = import.meta.dirname;

type PackageManifest = {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const manifest = JSON.parse(
  readFileSync(path.join(rootDir, "package.json"), "utf8"),
) as PackageManifest;

// Every runtime dependency and peer dependency stays outside the bundle so the
// consumer's package manager installs a single copy of each (react, radix-ui,
// @tanstack/react-table, openai, ...). Subpath imports such as
// "react/jsx-runtime" or "date-fns/locale" are covered by the prefix check.
const externalPackages = [
  ...Object.keys(manifest.dependencies ?? {}),
  ...Object.keys(manifest.peerDependencies ?? {}),
];

const isExternal = (id: string): boolean =>
  externalPackages.some((name) => id === name || id.startsWith(`${name}/`));

export default defineConfig({
  plugins: [react()],
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
