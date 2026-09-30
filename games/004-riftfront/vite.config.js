import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: { host: "0.0.0.0" },
  build: {
    rollupOptions: { output: { manualChunks: { three: ["three"] } } },
  },
});
