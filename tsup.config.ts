import fs from "fs";
import fg from "fast-glob";
import { defineConfig } from "tsup";

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

export default defineConfig([
  {
    entry: entries,
    outDir: "dist",
    format: ["cjs", "esm"],
    splitting: true,
    bundle: true,
    minify: "terser",
    treeshake: true,
    external: [
      "next",
      "react",
      "react-dom",
      "next/server",
      "date-fns",
      "server-only",
      "libphonenumber-js",
      "tailwindcss",
      "tailwind-merge-v3",
      "tailwind-merge-v4"
    ],
    noExternal: ["@rzl-zone/ts-types-plus"],
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

      options.plugins = [
        {
          name: "remove-types-runtime",
          setup(build) {
            build.onResolve({ filter: /\.(types|d)\.(ts|tsx)$/ }, (args) => {
              return { path: args.path, external: true };
            });

            build.onResolve({ filter: /^types\// }, (args) => {
              return { path: args.path, external: true };
            });

            build.onResolve({ filter: /src\/types\// }, (args) => {
              return { path: args.path, external: true };
            });
          }
        }
      ];
    },
    onSuccess: async () => {
      const removeJs = await fg([
        "dist/types/**/*.{js,js.map,cjs}",
        "dist/types/*.{js,js.map,cjs}"
      ]);
      for (const file of removeJs) {
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
    }
  }
]);
