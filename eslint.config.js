import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.ts", "*.js"],
    extends: [eslintJs.configs.recommended, tseslint.configs.recommended],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      semi: "error",
      "prefer-const": "warn",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
    ignores: ["dist/**/*", "node_modules/**/*", "docs/**/*", "deprecated/**/*"],
  },
]);
