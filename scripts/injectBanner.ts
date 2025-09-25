import fs from "fs";
import chalk from "chalk";
import fg from "fast-glob";
import { topBanner } from "./constants/banner";

export const injectBanner = async (pattern: string | string[]) => {
  try {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    const files: string[] = [];

    for (const p of patterns.sort()) {
      const matched = fg.sync(p, { absolute: false });
      files.push(...matched);
    }

    console.log(
      chalk.bold(
        `🕧 ${chalk.cyanBright("Starting")} to ${chalk.underline.blueBright(
          "Injecting Banner"
        )} at ${chalk.italic.underline.whiteBright("'dist'")} folder.`
      )
    );

    let injectedCount = 0;

    for (const filePath of files.sort()) {
      if (!fs.existsSync(filePath)) continue;

      const content = (await fs.promises.readFile(filePath, "utf8")).trimStart();
      const trimmed = content.trim();

      if (!trimmed || trimmed === '"use strict";' || trimmed === "'use strict';")
        continue;
      if (content.startsWith(topBanner)) continue;

      const finalContent = `${
        typeof topBanner === "string" && topBanner.trim().length ? topBanner + "\n" : ""
      }${content}`;
      await fs.promises.writeFile(filePath, finalContent, "utf8");

      injectedCount++;
      console.log(
        `${chalk.bold("   >")} ${chalk.italic(
          `${chalk.white(injectedCount + ".")} ${chalk.white(
            "Injected banner"
          )} ${chalk.yellowBright("in")} ${chalk.bold.underline.blueBright(filePath)}.`
        )}`
      );
    }

    if (injectedCount > 0) {
      console.log(
        chalk.bold(
          `✅ ${chalk.greenBright("Success")} ${chalk.underline.blueBright(
            "Injecting Banner"
          )} (${chalk.yellowBright(
            `${injectedCount} file${injectedCount > 1 ? "(s)" : ""}`
          )}) at ${chalk.italic.underline.whiteBright("'dist'")} folder.`
        )
      );
    } else {
      console.log(
        chalk.bold(
          `⚠️  ${chalk.yellowBright("Skipping")} ${chalk.underline.blueBright(
            "Injecting Banner"
          )} ${chalk.white("because")} ${chalk.redBright(
            "nothing left"
          )} files at ${chalk.italic.underline.whiteBright(
            "'dist'"
          )} folder to ${chalk.dim.redBright("injecting")}.`
        )
      );
    }
  } catch (e) {
    console.error(
      chalk.bold(
        `✅ ${chalk.redBright("Error")} to ${chalk.underline.blueBright(
          "Injecting Banner"
        )} at ${chalk.cyan("dist")} folder, because: \n\n > ${chalk.inverse.red(e)}`
      )
    );
  }
};

await injectBanner([
  "dist/**/*.{js,cjs,mjs,esm}",
  "dist/**/*.{ts,cts,mts,esm}",
  "dist/**/*.d.{ts,cts,mts,esm}"
]);
