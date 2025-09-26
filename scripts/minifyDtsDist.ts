import fg from "fast-glob";
import { readFileSync, writeFileSync } from "fs";

import { topBanner } from "./constants/banner";
import { BUILD_LOGGER } from "./utils/logger";

export const minifyDtsDist = async (
  pattern: string | string[],
  { topBanner }: { topBanner?: string } = {}
) => {
  try {
    const patterns = Array.isArray(pattern) ? pattern : [pattern];
    const files: string[] = [];

    for (const p of patterns.sort()) {
      const matched = fg.sync(p, { absolute: false });
      files.push(...matched);
    }

    BUILD_LOGGER.ON_STARTING({
      actionName: "Minify DTS"
    });

    files.forEach((filePath, idx) => {
      const content = readFileSync(filePath, "utf-8");

      type Part = {
        type: "code" | "jsdoc" | "top-banner" | "comment" | "triple-slash";
        content: string;
      };
      const parts: Part[] = [];
      let lastIndex = 0;

      // Regex: keep existing JSDoc/comment logic
      const regex =
        /\/\/\/\s*<reference[\s\S]*?\/>|\/\*\*[\s\S]*?\*\/|\/\*(?!\*)[\s\S]*?\*\//g;
      let match: RegExpExecArray | null = null;

      while ((match = regex.exec(content)) !== null) {
        const start = match.index;
        const end = regex.lastIndex;

        // Add code before the comment/triple-slash
        if (start > lastIndex) {
          parts.push({ type: "code", content: content.slice(lastIndex, start) });
        }

        // Determine part type
        if (match[0].startsWith("///")) {
          parts.push({ type: "triple-slash", content: match[0] });
        } else if (match[0].startsWith("/**")) {
          parts.push({ type: "jsdoc", content: match[0] });
        } else if (topBanner && match[0].includes(topBanner)) {
          parts.push({ type: "top-banner", content: match[0] });
        } else {
          parts.push({ type: "comment", content: match[0] });
        }

        lastIndex = end;
      }

      if (lastIndex < content.length) {
        parts.push({ type: "code", content: content.slice(lastIndex) });
      }

      const firstJsDocIndex = parts.findIndex((p) => p.type === "jsdoc");

      // Build result
      const result = parts
        .map((part, index) => {
          switch (part.type) {
            case "top-banner":
              return part.content.trim() + "\n"; // keep consecutive for top top banner
            case "triple-slash":
              return part.content.trim(); // keep consecutive triple-slash in place
            case "jsdoc":
              return index === firstJsDocIndex ? part.content + "" : `${part.content}`;
            case "comment":
              return ` ${part.content.replace(/\n/g, " ").replace(/\s+/g, " ")} `;
            case "code": {
              const fragments =
                part.content.match(/(["'`])(?:\\.|(?!\1).)*\1|[^"'`]+/g) || [];
              return fragments
                .map((frag) => {
                  if (/^["'`]/.test(frag)) return frag;
                  return frag
                    .replace(/[\n\r\t]/g, "")
                    .replace(/ {2,}/g, " ")
                    .replace(/\s*([|?:,])\s*/g, "$1")
                    .replace(/ ?([=:{},;()<>]) ?/g, "$1")
                    .replace(/ +/g, " ")
                    .trim();
                })
                .join("");
            }
          }
        })
        .filter(Boolean)
        .join("\n");

      const finalResult = result
        .replace(/;(?=\/\*\*)/g, ";\n")
        .replace(/\{(?=\/\*\*)/g, "{\n")
        .replace(/(^|\n)[ \t]+(\*)/g, "$1 $2");

      writeFileSync(filePath, finalResult, "utf-8");

      BUILD_LOGGER.ON_PROCESS({
        actionName: "DTS minified",
        textDirectFolder: "at",
        count: idx + 1,
        nameDirect: filePath
      });
    });

    BUILD_LOGGER.ON_FINISH({
      actionName: "Minify DTS",
      count: files.length
    });
  } catch (error) {
    BUILD_LOGGER.ON_ERROR({
      actionName: "DTS minified",
      error
    });
  }
};

await minifyDtsDist(["dist/**/*.d.{ts,mts,cts,ets,esm}"], { topBanner });
