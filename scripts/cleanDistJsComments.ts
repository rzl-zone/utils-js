import fs from "fs";
import glob from "fast-glob";

type CleanOptions = {
  /**
   * If true, remove target comments AND adjacent empty lines, otherwise
   * remove only target comments, keep empty lines.
   *
   * @default false
   */
  removeAdjacentEmptyLines?: boolean; // default: false
};

/**
 * Remove target comments (`// src/...`, `// node_modules/...`, or `// eslint...`) from files.
 * Can also remove adjacent empty lines if specified.
 */
const cleanDistJsComments = async (
  pattern: string | string[],
  options: CleanOptions = {}
) => {
  const { removeAdjacentEmptyLines = false } = options;
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  const files: string[] = [];

  // Collect all matched files
  for (const p of patterns) {
    const matched = glob.sync(p, { absolute: true });
    files.push(...matched);
  }

  for (const filePath of files) {
    if (
      !filePath.endsWith(".js") &&
      !filePath.endsWith(".cjs") &&
      !filePath.endsWith(".mjs")
    )
      continue;
    if (!fs.existsSync(filePath)) continue;

    const content = await fs.promises.readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    const cleanedLines = lines
      .filter((line, i, arr) => {
        // Remove lines that contain only target comments
        if (/^[ \t]*\/\/\s*(src|node_modules)\//.test(line)) return false;
        if (/^[ \t]*\/\/\s*eslint/.test(line)) return false;

        // If enabled, remove empty lines adjacent to target comments
        if (removeAdjacentEmptyLines && /^\s*$/.test(line)) {
          const prev = arr[i - 1];
          const next = arr[i + 1];
          if (
            (prev &&
              (/^[ \t]*\/\/\s*(src|node_modules)/.test(prev) ||
                /^[ \t]*\/\/\s*eslint/.test(prev))) ||
            (next &&
              (/^[ \t]*\/\/\s*(src|node_modules)/.test(next) ||
                /^[ \t]*\/\/\s*eslint/.test(next)))
          ) {
            return false;
          }
        }

        return true;
      })
      .map((line) =>
        // Remove inline target comments but keep code
        line
          .replace(/\/\/\s*(src|node_modules)\/[^\n]*/g, "")
          .replace(/\/\/\s*eslint[^\n]*/g, "")
      );

    const finalContent = cleanedLines.join("\n");

    if (finalContent !== content) {
      await fs.promises.writeFile(filePath, finalContent, "utf8");
      console.log(
        `🗑 Cleaned comments in ${filePath} (removeAdjacentEmptyLines=${removeAdjacentEmptyLines})`
      );
    }
  }
};

(async () => {
  // Remove target comments AND adjacent empty lines
  await cleanDistJsComments("dist/**/*.{js,cjs,mjs}", { removeAdjacentEmptyLines: true });
})();
