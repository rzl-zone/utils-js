import type { PackageJson } from "type-fest";

import fs from "fs";
import path from "path";
import { safeJsonParse } from "@/conversions";
import { isNonEmptyString } from "@/predicates";

const pkgJson = path.resolve("./package.json");
const pkg = safeJsonParse<PackageJson, typeof pkgJson>(fs.readFileSync(pkgJson, "utf-8"));
const PKG_VERSION = isNonEmptyString(pkg?.version) ? `${pkg.version}` : "Unknown";
// const PKG_LICENSE = isNonEmptyString(pkg?.license) ? `${pkg.license}` : "Unknown";
const PKG_HOMEPAGE = isNonEmptyString(pkg?.homepage)
  ? `${pkg.homepage.split("#")[0]}`
  : "https://github.com/rzl-zone";

export const topBanner = `/*!
 * ====================================================
 * Rzl Utils-JS.
 * ----------------------------------------------------
 * Version: ${PKG_VERSION}.
 * Author: Rizalvin Dwiky.
 * Repository: ${PKG_HOMEPAGE}.
 * ====================================================
 */`;
