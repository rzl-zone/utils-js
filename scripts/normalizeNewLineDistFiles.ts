import fs from "fs";
import fg from "fast-glob";
import { isNonEmptyArray } from "@/predicates";
import chalk from "chalk";

const normalizeCleanDistFiles = async (pattern: string | string[]) => {
  try {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    const files: string[] = [];

    for (const p of patterns) {
      const matched = (await fg(p, { absolute: false })).sort();
      files.push(...matched);
    }

    console.log(
      chalk.bold(
        `🕧 ${chalk.cyanBright("Starting")} to ${chalk.underline.blueBright(
          "Normalize New Lines"
        )} at ${chalk.italic.underline.whiteBright("'dist'")} folder.`
      )
    );

    const filesToClean = [];
    for (const filePath of files) {
      if (!filePath.match(/\.(js|cjs|mjs)$/)) continue;
      if (!fs.existsSync(filePath)) continue;

      const content = await fs.promises.readFile(filePath, "utf8");
      if (/(\r?\n){3,}/.test(content)) {
        filesToClean.push(filePath);
      }
    }

    for (const [idx, filePath] of filesToClean.entries()) {
      const content = await fs.promises.readFile(filePath, "utf8");
      const finalContent = content.replace(/(\r?\n){3,}/g, "\r\n\r\n");

      if (finalContent !== content) {
        await fs.promises.writeFile(filePath, finalContent, "utf8");

        console.log(
          `${chalk.bold("   >")} ${chalk.italic(
            `${chalk.white(idx + 1 + ".")} ${chalk.white(
              "Normalize New Lines"
            )} ${chalk.cyan("in")} ${chalk.bold.underline.blueBright(filePath)}.`
          )}`
        );
      }
    }

    if (isNonEmptyArray(filesToClean)) {
      console.log(
        chalk.bold(
          `✅ ${chalk.greenBright("Success")} ${chalk.underline.blueBright(
            "Normalize New Lines"
          )} (${chalk.yellowBright(
            `${filesToClean.length} file${filesToClean.length > 1 ? "(s)" : ""}`
          )}) at ${chalk.italic.underline.whiteBright("'dist'")} folder.`
        )
      );
    } else {
      console.log(
        chalk.bold(
          `⚠️  ${chalk.yellowBright("Skipping")} ${chalk.underline.blueBright(
            "Normalize New Lines"
          )} ${chalk.white("because")} ${chalk.redBright(
            "nothing left"
          )} files at ${chalk.italic.underline.whiteBright(
            "'dist'"
          )} folder to ${chalk.dim.redBright("normalize")}.`
        )
      );
    }
  } catch (e) {
    console.error(
      chalk.bold(
        `✅ ${chalk.redBright("Error")} to ${chalk.underline.blueBright(
          "Normalize New Lines"
        )} at ${chalk.cyan("dist")} folder, because: \n\n > ${chalk.inverse.red(e)}`
      )
    );
  }
};

await normalizeCleanDistFiles("dist/**/*.{js,cjs,mjs}");
