import fs from "fs";
import chalk from "chalk";
import fg from "fast-glob";
import { isNonEmptyArray } from "@/predicates";

type CleanOptions = {
  removeAdjacentEmptyLines?: boolean; // default: false
};

const cleanDistJsComments = async (
  pattern: string | string[],
  options: CleanOptions = {}
) => {
  try {
    const { removeAdjacentEmptyLines = false } = options;
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    const files: string[] = [];

    for (const p of patterns) {
      const matched = (await fg(p, { absolute: false })).sort();
      files.push(...matched);
    }

    console.log(
      chalk.bold(
        `🕧 ${chalk.cyanBright("Starting")} to ${chalk.underline.blueBright(
          "Cleaning JS Comment"
        )} at ${chalk.italic.underline.whiteBright("'dist'")} folder.`
      )
    );

    const filesToClean: string[] = [];
    for (const filePath of files) {
      if (!filePath.match(/\.(js|cjs|mjs)$/)) continue;
      if (!fs.existsSync(filePath)) continue;

      const content = await fs.promises.readFile(filePath, "utf8");
      const lines = content.split(/\r?\n/);

      const hasTarget = lines.some((line, i, arr) => {
        if (/^[ \t]*\/\/\s*(src|node_modules)\//.test(line)) return true;
        if (/^[ \t]*\/\/\s*eslint/.test(line)) return true;
        if (
          removeAdjacentEmptyLines &&
          /^\s*$/.test(line) &&
          ((arr[i - 1] &&
            (/^[ \t]*\/\/\s*(src|node_modules)/.test(arr[i - 1]) ||
              /^[ \t]*\/\/\s*eslint/.test(arr[i - 1]))) ||
            (arr[i + 1] &&
              (/^[ \t]*\/\/\s*(src|node_modules)/.test(arr[i + 1]) ||
                /^[ \t]*\/\/\s*eslint/.test(arr[i + 1]))))
        ) {
          return true;
        }

        return false;
      });

      if (hasTarget) filesToClean.push(filePath);
    }

    for (const [index, filePath] of filesToClean.entries()) {
      const content = await fs.promises.readFile(filePath, "utf8");
      const lines = content.split(/\r?\n/);

      const cleanedLines = lines
        .filter((line, i, arr) => {
          if (/^[ \t]*\/\/\s*(src|node_modules)\//.test(line)) return false;
          if (/^[ \t]*\/\/\s*eslint/.test(line)) return false;

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
        .map((line) => {
          return line
            .replace(/\/\/\s*(src|node_modules)\/[^\n]*/g, "")
            .replace(/\/\/\s*eslint[^\n]*/g, "");
        });

      const finalContent = cleanedLines.join("\n");

      if (finalContent !== content) {
        await fs.promises.writeFile(filePath, finalContent, "utf8");
        console.log(
          `${chalk.bold("   >")} ${chalk.italic(
            `${chalk.white(index + 1 + ".")} ${chalk.white(
              "Cleaned JS Comment"
            )} ${chalk.cyan("in")} '${chalk.bold.underline.cyanBright(filePath)}'.`
          )}`
        );
      }
    }

    if (isNonEmptyArray(filesToClean)) {
      console.log(
        chalk.bold(
          `✅ ${chalk.greenBright("Success")} ${chalk.underline.blueBright(
            "Cleaned JS Comment"
          )} (${chalk.yellowBright(
            `${filesToClean.length} file${filesToClean.length > 1 ? "(s)" : ""}`
          )}) at ${chalk.italic.underline.whiteBright("'dist'")} folder.`
        )
      );
    } else {
      console.log(
        chalk.bold(
          `⚠️  ${chalk.yellowBright("Skipping")} ${chalk.underline.blueBright(
            "Cleaned JS Comment"
          )} ${chalk.white("because")} ${chalk.redBright(
            "nothing left"
          )} files at ${chalk.italic.underline.whiteBright(
            "'dist'"
          )} folder to ${chalk.dim.redBright("cleaning")}.`
        )
      );
    }
  } catch (e) {
    console.error(
      chalk.bold(
        `✅ ${chalk.redBright("Error")} to ${chalk.underline.blueBright(
          "Cleaned JS Comment"
        )} at ${chalk.cyan("dist")} folder, because: \n\n > ${chalk.inverse.red(e)}`
      )
    );
  }
};

await cleanDistJsComments("dist/**/*.{js,cjs,mjs}", {
  removeAdjacentEmptyLines: false
});
