import path from "path";
import fg from "fast-glob";
import { writeFileSync } from "fs";

const distDir = path.resolve("./dist");
const outFile = path.join(distDir, "index.d.ts");

console.log("🔃 Generate reference for dist/index.d.ts Starting...");

try {
  writeFileSync(outFile, "");
} catch {}

const files = await fg(
  [
    "*/index.d.ts",
    "*/**/index.d.ts",
    "*/index.d.mts",
    "*/**/index.d.mts",
    "*/index.d.cts",
    "*/**/index.d.cts",
    "*/index.d.esm",
    "*/**/index.d.esm"
  ],
  {
    cwd: distDir,
    absolute: false
  }
);

const references = files.map((f) => {
  const normalized = f.replace(/\\/g, "/");
  return `/// <reference path="./${normalized}" />`;
});

writeFileSync(outFile, references.join("\n") + "\n");

console.log("✅ Generate reference for dist/index.d.ts finish...");
