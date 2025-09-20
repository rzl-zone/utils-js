// dts.config.js
const fg = require("fast-glob");

/** @type {import("./dts-config").ConfigEntryPoint[]} */
const configs = fg
  .sync(
    [
      // "dist/index.d.ts",
      "dist/*/index.d.ts",
      "dist/*/index.d.tsx",
      "dist/*/server/index.d.ts",
      "dist/*/server/index.d.tsx"
    ],
    {
      ignore: ["dist/*/server/index.d.ts", "dist/*/server/index.d.tsx"]
    }
  )
  .map((file) => {
    /** @type {import("./dts-config").ConfigEntryPoint} */
    const configOption = {
      filePath: file,
      outFile: `dist/${file
        .replace(/^(src|dist)\//, "")
        .replace(/\.(ts|tsx|d.ts)$/, ".d.ts")}`,
      noCheck: true,
      output: {
        noBanner: true,
        exportReferencedTypes: false
      },
      libraries: {
        inlinedLibraries: ["@rzl-zone/ts-types-plus", "clsx"],
        importedLibraries: [
          "react",
          "react-dom",
          "date-fns",
          "libphonenumber-js",
          "tailwindcss",
          "tailwind-merge-v3",
          "tailwind-merge-v4",
          "next",
          "next/server",
          "server-only"
        ]
      }
    };

    return configOption;
  });

/**
 * @type {import("./dts-config").BundlerConfig}
 */
module.exports = {
  compilationOptions: {
    preferredConfigPath: "./tsconfig.json"
  },

  entries: configs
};
