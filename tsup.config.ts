import fs from "fs";
import fg from "fast-glob";
import { defineConfig, Options } from "tsup";

const entries = await fg(
  [
    "src/index.ts",
    "src/*/index.{ts,tsx}",
    "src/next/index.ts",
    "src/next/server/index.ts"
  ],
  {
    ignore: [
      "src/browser.ts",
      "src/types/private",
      "src/**/*.types.*",
      "src/types",
      "src/**/types.{ts,tsx}",
      "src/**/*.types.{ts,tsx}",
      "src/*.types.{ts,tsx}"
    ]
  }
);

const externalDefault: Options["external"] = [
  "next",
  "react",
  "clsx",
  "react-dom",
  "next/server",
  "date-fns",
  "server-only",
  "libphonenumber-js",
  "tailwindcss",
  "tailwind-merge-v3",
  "tailwind-merge-v4"
];
const nonExternalDefault: Options["noExternal"] = ["@rzl-zone/ts-types-plus"];

export default defineConfig([
  {
    entry: entries,
    outDir: "dist",
    format: ["cjs", "esm"],
    splitting: true,
    bundle: true,
    minify: false,
    treeshake: true,
    external: externalDefault,
    noExternal: nonExternalDefault,
    dts: true,
    clean: false,
    terserOptions: {
      format: {
        comments: false
      }
    },
    esbuildOptions(options) {
      options.legalComments = "none";
      options.ignoreAnnotations = true;

      return options;
    },
    onSuccess: async () => {
      const removeJs = await fg([
        "dist/types/**/*.{js,js.map,cjs}",
        "dist/types/*.{js,js.map,cjs}"
      ]);
      for (const file of removeJs.sort()) {
        fs.rmSync(file, { force: true });
      }
    }
  },

  {
    entry: { "rzl-utils": "src/browser.ts" },
    format: ["iife"],
    globalName: "RzlUtilsJs",
    external: [],
    minify: "terser",
    treeshake: true,
    splitting: false,
    dts: false,
    clean: false,
    bundle: true,
    terserOptions: {
      format: {
        comments: false
      }
    },
    esbuildOptions(options) {
      options.minifyWhitespace = true;
      options.minifyIdentifiers = true;
      options.minifySyntax = true;
      options.legalComments = "none";
      options.plugins = [];

      return options;
    }
  }
]);
