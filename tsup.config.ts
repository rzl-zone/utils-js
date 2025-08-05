import { defineConfig } from "tsup";

export default defineConfig([
  //todo: bundle global utils
  {
    entry: ["src/index.ts"],
    external: [],
    format: ["cjs", "esm"],
    dts: true,
    treeshake: true,
    splitting: false,
    minify: true,
    sourcemap: false,
    bundle: true,
    clean: true,
    esbuildOptions(options) {
      options.legalComments = "none";
    },
  },

  //todo: bundle umd/global for browser
  {
    entry: { "rzl-utils": "src/index.ts" },
    format: ["iife"],
    globalName: "RzlUtilsJs",
    minify: true,
    treeshake: true,
    splitting: false,
    clean: true,
    bundle: true,
    // outExtension({ format }) {
    //   return {
    //     js: format === "iife" ? ".js" : `.${format}.js`,
    //   };
    // },
    esbuildOptions(options) {
      options.legalComments = "none";
    },
  },

  //todo: bundle nextjs-client
  {
    entry: ["src/next/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    treeshake: true,
    outDir: "dist/next",
    external: ["next", "next/*", "react", "react/*"],
    splitting: false,
    minify: true,
    sourcemap: false,
    bundle: true,
    clean: true,
    esbuildOptions(options) {
      options.legalComments = "none";
    },
  },
  //todo: bundle nextjs-server
  {
    entry: ["src/next/server/index.ts"],
    outDir: "dist/next/server",
    format: ["cjs", "esm"],
    dts: true,
    treeshake: true,
    external: ["next", "next/server", "next/*", "react", "react-dom"],
    bundle: true,
    clean: true,
    splitting: false,
    minify: true,
    sourcemap: false,
    esbuildOptions(options) {
      options.legalComments = "none";
    },
  },
]);
