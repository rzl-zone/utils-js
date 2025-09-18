// scripts/generate-barrel.ts
import { globSync } from "glob";
import { writeFileSync } from "fs";
import path from "path";

const distDir = path.resolve("./dist");
const outFile = path.join(distDir, "index.d.ts");

console.log("🔃 Generate reference for dist/index.d.ts Starting...");

// Pastikan folder dist ada
try {
  writeFileSync(outFile, "");
} catch {}

// Cari semua index.d.ts di subfolder dist
const files = globSync("*/index.d.ts", { cwd: distDir, absolute: false });

// Buat reference ke setiap index.d.ts
const references = files.map((f) => {
  const normalized = f.replace(/\\/g, "/"); // ubah backslash jadi slash
  return `/// <reference path="./${normalized}" />`;
});

// Tulis ke dist/index.d.ts
writeFileSync(outFile, references.join("\n") + "\n");

console.log("✅ Generate reference for dist/index.d.ts finish...");
