/** * @see https://github.com/timocov/dts-bundle-generator */

/** @type {import('./dts-config').BundlerConfig} */
module.exports = {
  compilationOptions: {
    preferredConfigPath: "./tsconfig.json",
  },
  entries: [
    //todo: dts all types
    {
      filePath: "./src/_types-entry.ts",
      outFile: "./dist/types/index.d.ts",
      noCheck: true,
      output: {
        noBanner: true,
        exportReferencedTypes: false,
      },
      libraries: {
        inlinedLibraries: ["type-samurai"],
        importedLibraries: [],
      },
    },

    //todo: dts all of global utils types
    {
      filePath: "./src/index.ts",
      outFile: "./dist/index.d.ts",
      noCheck: true,
      output: {
        noBanner: true,
        exportReferencedTypes: false,
      },
      libraries: {
        // inlinedLibraries: ["type-samurai", "date-fns/locale", "date-fns"],
        inlinedLibraries: ["type-samurai", "lodash"],
        importedLibraries: ["date-fns/locale", "date-fns"],
      },
    },

    //todo: dts next-js/client types
    {
      filePath: "./src/next/index.ts",
      outFile: "./dist/next/index.d.ts",
      noCheck: true,
      output: {
        noBanner: true,
        exportReferencedTypes: false,
      },
      libraries: {
        inlinedLibraries: [],
        importedLibraries: [],
      },
    },
  ],
};
