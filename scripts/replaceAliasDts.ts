import fs from "fs";
import path from "path";

function replaceAlias(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      replaceAlias(full);
    } else if (full.endsWith(".d.ts")) {
      let content = fs.readFileSync(full, "utf8");
      content = content.replace(/from ["']@\/types["']/g, 'from "../../types"');
      fs.writeFileSync(full, content, "utf8");
      console.log(`Fixed alias in ${full}`);
    }
  }
}

replaceAlias("./dist");
