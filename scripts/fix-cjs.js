import fs from "fs";
import path from "path";

const distDir = "./dist";
const files = fs.readdirSync(distDir);

for (const file of files) {
  if (file.endsWith(".cjs")) {
    const filePath = path.join(distDir, file);
    let content = fs.readFileSync(filePath, "utf8");

    // Ubah `module.exports.default =` jadi `module.exports =`
    content = content.replace(
      /module\.exports\.default\s*=\s*/,
      "module.exports = "
    );

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Fixed CJS export in ${file}`);
  }
}
