import fs from "fs";
import path from "path";
import fg from "fast-glob";
import chalk from "chalk";
import { isNonEmptyArray } from "@/predicates";

const distDir = path.relative(process.cwd(), "./dist");
const outFile = path.join(distDir, "index.d.ts");
const outFileNormalize = outFile.replace(/\\/g, "/");

console.log(
  chalk.bold(
    `🕧 ${chalk.cyanBright("Starting")} to ${chalk.underline.blueBright(
      "Generate Reference"
    )} at ${chalk.italic.underline.whiteBright(outFileNormalize)} folder.`
  )
);

try {
  fs.writeFileSync(outFile, "");

  const files = (
    await fg(["*/index.d.{ts,mts,cts,ets}", "*/**/index.d.{ts,mts,cts,ets}"], {
      cwd: distDir,
      absolute: false
    })
  ).sort();

  let references: string[] = [];

  if (isNonEmptyArray(files)) {
    references.push("//! References Paths:\n");
  }
  references.push(
    files
      .map((f, i) => {
        const normalized = f.replace(/\\/g, "/");

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
        const normalized = f.replace(/\\/g, "/").split(".")[0];

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

  fs.writeFileSync(outFile, references.join("") + "\n");

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
} catch (e) {
  console.error(
    chalk.bold(
      `✅ ${chalk.redBright("Error")} to ${chalk.underline.blueBright(
        "Generate Reference and Adding Exported Types"
      )} at ${chalk.cyan(outFileNormalize)} file, because: \n\n > ${chalk.inverse.red(e)}`
    )
  );
}
