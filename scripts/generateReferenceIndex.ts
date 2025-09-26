import fs from "fs";
import path from "path";
import fg from "fast-glob";
import chalk from "chalk";
import { isNonEmptyArray } from "@/predicates";
import { BUILD_LOGGER } from "./utils/logger";

export const generateReferenceIndex = async (
  pattern: string | string[],
  options = {
    withExportTypes: false
  }
) => {
  let outFileNormalize: string = "dist/index.d.ts";
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

    BUILD_LOGGER.ON_STARTING({
      actionName: "Generating References",
      atFolder: outFileNormalize
    });

    fs.writeFileSync(outFile, "");

    const references: string[] = [];

    if (isNonEmptyArray(files)) {
      references.push("//! References Paths:\n");
    }

    references.push(
      files
        .map((f, i) => {
          const normalized = f.replace(/\\/g, "/").split("dist/")?.[1];

          BUILD_LOGGER.ON_PROCESS_REFERENCING({
            actionName: "Generated Reference",
            count: i + 1,
            referenceFrom: normalized,
            referenceTo: outFileNormalize
          });

          return `/// <reference path="./${normalized}" />`;
        })
        .join("\n")
    );

    if (isNonEmptyArray(files)) {
      BUILD_LOGGER.ON_FINISH({
        actionName: "Generating Reference",
        count: files.length,
        typeCount: "reference",
        textDirectFolder: "to",
        atFolder: outFileNormalize,
        typeDirect: "file"
      });
    } else {
      BUILD_LOGGER.ON_SKIPPING({
        actionName: "Generating References",
        reasonEndText: "referencing",
        reasonType: "references"
      });
    }

    if (options.withExportTypes) {
      console.log(
        chalk.bold.magentaBright(
          "\n=======================================================================================\n"
        )
      );

      BUILD_LOGGER.ON_STARTING({
        actionName: "Adding Exported Types",
        atFolder: outFileNormalize
      });

      if (isNonEmptyArray(files)) {
        references.push("\n\n//! Exported Types:\n");
      }

      references.push(
        files
          .map((f, i) => {
            const normalized = f.replace(/\\/g, "/").split(".")[0].split("dist/")?.[1];

            BUILD_LOGGER.ON_PROCESS_REFERENCING({
              actionName: "Exported Type",
              count: i + 1,
              referenceFrom: normalized,
              referenceTo: outFileNormalize
            });

            return `export * from "./${normalized}";`;
          })
          .join("\n")
      );

      if (isNonEmptyArray(files)) {
        BUILD_LOGGER.ON_FINISH({
          actionName: "Adding Exported Types",
          count: files.length,
          typeCount: "type",
          textDirectFolder: "to",
          atFolder: outFileNormalize,
          typeDirect: "file"
        });
      } else {
        BUILD_LOGGER.ON_SKIPPING({
          actionName: "Adding Exported Types",
          reasonEndText: "exporting",
          reasonType: "types"
        });
      }
    }

    fs.writeFileSync(outFile, references.join("") + "\n");
  } catch (error) {
    BUILD_LOGGER.ON_ERROR({
      actionName:
        "Generating References" +
        (options.withExportTypes ? " and Adding Exported Types" : ""),
      error,
      atFolder: outFileNormalize,
      typeDirect: "file"
    });
  }
};

await generateReferenceIndex(["dist/*/**/*.d.{ts,mts,cts,ets}"], {
  withExportTypes: true
});
