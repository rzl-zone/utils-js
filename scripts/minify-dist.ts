import { globSync } from "glob";
import { readFileSync, writeFileSync } from "fs";

const files = globSync("dist/**/*.d.ts");

console.log(`Minify Starting`);

files.forEach((filePath) => {
  const content = readFileSync(filePath, "utf-8");

  const parts: Record<string, string>[] = [];
  let lastIndex = 0;

  const regex = /\/\*\*[\s\S]*?\*\/|\/\*(?!\*)[\s\S]*?\*\//g;
  let match: RegExpExecArray | null = null;

  while ((match = regex.exec(content)) !== null) {
    const start = match.index;
    const end = regex.lastIndex;

    if (start > lastIndex) {
      parts.push({ type: "code", content: content.slice(lastIndex, start) });
    }

    const isJsDoc = match[0].startsWith("/**");
    parts.push({ type: isJsDoc ? "jsdoc" : "comment", content: match[0] });
    lastIndex = end;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "code", content: content.slice(lastIndex) });
  }

  const firstJsDocIndex = parts.findIndex((p) => p.type === "jsdoc");

  const result =
    parts
      .map((part, index) => {
        if (part.type === "jsdoc") {
          if (index === firstJsDocIndex) {
            return part.content + "\n";
          }
          return `\n${part.content}\n`;
        }
        if (part.type === "comment") {
          // normalize comment: replace newlines with space and collapse multiple spaces
          return ` ${part.content.replace(/\n/g, " ").replace(/\s+/g, " ")} `;
        }

        // code section: safe for string literals
        const code = part.content;
        // split code into string literals and normal code
        const fragments = code.match(/(["'`])(?:\\.|(?!\1).)*\1|[^"'`]+/g) || [];

        return fragments
          .map((frag: string) => {
            if (/^["'`]/.test(frag)) {
              // string literal, leave as-is
              return frag;
            }
            // normal code: remove spaces/tabs/newlines around | ? : , and apply other minify rules
            return frag
              .replace(/[\n\r\t]/g, "")
              .replace(/ {2,}/g, " ")
              .replace(/\s*([|?:,])\s*/g, "$1")
              .replace(/ ?([=:{},;()<>]) ?/g, "$1")
              .replace(/ +/g, " ")
              .trim();
          })
          .join("");
      })
      .filter(Boolean)
      .join("") + "\n";

  const finalResult = result
    .replace(/;(?=\/\*\*)/g, ";\n")
    .replace(/\{(?=\/\*\*)/g, "{\n")
    .replace(/(^|\n)[ \t]+(\*)/g, "$1 $2");
  // .replace(/(^|\n)[ \t]*\*(?= )?/g, "$1 *");

  writeFileSync(filePath, finalResult, "utf-8");
  console.log(`✔️  Minified: ${filePath}`);
});

console.log(`✔️ ✔️ ✔️  Minify Finish`);
