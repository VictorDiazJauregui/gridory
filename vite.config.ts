import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
        index: path.resolve(__dirname, "src/index.ts"),
        table: path.resolve(__dirname, "src/table.ts"),
        kanban: path.resolve(__dirname, "src/kanban.ts"),
        ai: path.resolve(__dirname, "src/ai.ts"),
      },
      formats: ["es"],
      cssFileName: "gridory",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
