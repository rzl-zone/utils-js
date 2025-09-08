import { configDefaults, defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      src: path.resolve(__dirname, "src")
    },
    extensions: [".js", ".ts", ".json"]
  },
  test: {
    exclude: [...configDefaults.exclude, "**/*deprecated*/**", "**/*deprecated*.test.ts"]
  }
});
