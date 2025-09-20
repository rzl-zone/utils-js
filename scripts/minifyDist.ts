import { globSync } from "glob";
import { readFileSync, writeFileSync } from "fs";

const files = globSync([
  "dist/**/*.d.ts",
  "dist/**/*.d.mts",
  "dist/**/*.d.cts",
  "dist/**/*.d.esm"
]);

console.log(`Minify Starting`);

files.forEach((filePath) => {
  const content = readFileSync(filePath, "utf-8");

  type Part = { type: "code" | "jsdoc" | "comment" | "triple-slash"; content: string };
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
        case "triple-slash":
          return part.content.trim(); // keep consecutive triple-slash in place
        case "jsdoc":
          return index === firstJsDocIndex ? part.content + "" : `${part.content}`;
        case "comment":
          return ` ${part.content.replace(/\n/g, " ").replace(/\s+/g, " ")} `;
        case "code":
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
    })
    .filter(Boolean)
    .join("\n"); // <-- newline between parts, triple-slash keep no newline

  const finalResult = result
    .replace(/;(?=\/\*\*)/g, ";\n")
    .replace(/\{(?=\/\*\*)/g, "{\n")
    .replace(/(^|\n)[ \t]+(\*)/g, "$1 $2");

  writeFileSync(filePath, finalResult, "utf-8");
  console.log(`✔️  Minified: ${filePath}`);
});

console.log(`✔️ ✔️ ✔️  Minify Finish`);
