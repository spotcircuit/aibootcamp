// Stub vite.config.ts for Next.js build - No imports that rely on Vite
import path from "path";

// Stub config object for compatibility
export default {
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
};