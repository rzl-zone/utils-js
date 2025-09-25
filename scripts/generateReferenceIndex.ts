import fs from "fs";
import path from "path";
import fg from "fast-glob";
import chalk from "chalk";
import { isNonEmptyArray } from "@/predicates";

export const generateReferenceIndex = async (
  pattern: string | string[],
  options = {
    withExportTypes: false
  }
) => {
  let outFileNormalize: string | undefined;

  try {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    const files: string[] = [];

    for (const p of patterns) {
      const matched = (await fg(p, { absolute: false })).sort();
      files.push(...matched);
    }

    const distDir = path.relative(process.cwd(), "./dist");
    const outFile = path.join(distDir, "index.d.ts");
    outFileNormalize = outFile.replace(/\\/g, "/");

    console.log(
      chalk.bold(
        `🕧 ${chalk.cyanBright("Starting")} to ${chalk.underline.blueBright(
          "Generate Reference"
        )} at ${chalk.italic.underline.whiteBright(outFileNormalize)} folder.`
      )
    );

    fs.writeFileSync(outFile, "");

    let references: string[] = [];

    if (isNonEmptyArray(files)) {
      references.push("//! References Paths:\n");
    }

    references.push(
      files
        .map((f, i) => {
          const normalized = f.replace(/\\/g, "/").split("dist/")?.[1];

          console.log(
            `${chalk.bold("   >")} ${chalk.italic(
              `${chalk.white(i + 1 + ".")} ${chalk.white(
                "Generate Reference"
              )} ${chalk.magentaBright("for")} ${chalk.bold.underline.cyanBright(
                normalized
              )} ${chalk.bold.gray("➔")} ${chalk.bold.underline.blueBright(
                outFileNormalize
              )}.`
            )}`
          );

          return `/// <reference path="./${normalized}" />`;
        })
        .join("\n")
    );

    if (isNonEmptyArray(files)) {
      console.log(
        chalk.bold(
          `✅ ${chalk.greenBright("Success")} ${chalk.underline.blueBright(
            "Generate Reference"
          )} (${chalk.yellowBright(
            `${files.length} reference${files.length > 1 ? "(s)" : ""}`
          )}) to ${chalk.italic.underline.whiteBright(outFileNormalize)} file.`
        )
      );
    } else {
      console.log(
        chalk.bold(
          `⚠️  ${chalk.yellowBright("Skipping")} ${chalk.underline.blueBright(
            "Generate Reference"
          )} ${chalk.white("because")} ${chalk.redBright(
            "nothing left"
          )} files at ${chalk.italic.underline.whiteBright(
            "'dist'"
          )} folder to ${chalk.dim.redBright("referencing")}.`
        )
      );
    }

    if (options.withExportTypes) {
      console.log(
        chalk.bold.magentaBright(
          "\n=======================================================================================\n"
        )
      );

      console.log(
        chalk.bold(
          `🕧 ${chalk.cyanBright("Starting")} to ${chalk.underline.blueBright(
            "Added Exported Types"
          )} at ${chalk.italic.underline.whiteBright(outFileNormalize)} folder.`
        )
      );

      if (isNonEmptyArray(files)) {
        references.push("\n\n//! Exported Types:\n");
      }

      references.push(
        files
          .map((f, i) => {
            const normalized = f.replace(/\\/g, "/").split(".")[0].split("dist/")?.[1];

            console.log(
              `${chalk.bold("   >")} ${chalk.italic(
                `${chalk.white(i + 1 + ".")} ${chalk.white(
                  "Added Exported Type"
                )} ${chalk.magentaBright("from")} ${chalk.bold.underline.cyanBright(
                  normalized
                )} ${chalk.bold.gray("➔")} ${chalk.bold.underline.blueBright(
                  outFileNormalize
                )}.`
              )}`
            );
            return `export * from "./${normalized}";`;
          })
          .join("\n")
      );

      if (isNonEmptyArray(files)) {
        console.log(
          chalk.bold(
            `✅ ${chalk.greenBright("Success")} ${chalk.underline.blueBright(
              "Added Exported Types"
            )} (${chalk.yellowBright(
              `${files.length} type${files.length > 1 ? "(s)" : ""}`
            )}) to ${chalk.italic.underline.whiteBright(outFileNormalize)} file.`
          )
        );
      } else {
        console.log(
          chalk.bold(
            `⚠️  ${chalk.yellowBright("Skipping")} ${chalk.underline.blueBright(
              "Added Exported Types"
            )} ${chalk.white("because")} ${chalk.redBright(
              "nothing left"
            )} files at ${chalk.italic.underline.whiteBright(
              "'dist'"
            )} folder to ${chalk.dim.redBright("exporting")}.`
          )
        );
      }
    }

    fs.writeFileSync(outFile, references.join("") + "\n");
  } catch (e) {
    console.error(
      chalk.bold(
        `✅ ${chalk.redBright("Error")} to ${chalk.underline.blueBright(
          "Generate Reference" +
            (options.withExportTypes ? " and Adding Exported Types" : "")
        )} at ${chalk.cyan(outFileNormalize)} file, because: \n\n > ${chalk.inverse.red(
          e
        )}`
      )
    );
  }
};

await generateReferenceIndex(
  ["dist/*/index.d.{ts,mts,cts,ets}", "dist/*/**/index.d.{ts,mts,cts,ets}"],
  { withExportTypes: false }
);
