import { isEmptyString } from "@/predicates";

const KNOWN_EXTENSIONS = new Set([
  // 📄 Text & Document
  "txt",
  "md",
  "rtf",
  "tex",
  "doc",
  "docx",
  "odt",
  "ott",
  "pdf",
  "djvu",
  "epub",
  "mobi",
  "azw",
  "azw3",
  "xls",
  "xlsx",
  "ods",
  "csv",
  "tsv",
  "ppt",
  "pptx",
  "odp",
  "pps",
  "md",
  "bib",
  "tex",
  "log",

  // 🖼️ Image
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tif",
  "tiff",
  "webp",
  "svg",
  "ico",
  "heif",
  "heic",
  "raw",
  "cr2",
  "nef",
  "orf",
  "sr2",
  "dng",
  "dds",
  "psd",
  "exr",
  "xcf",
  "ai",
  "eps",
  "cdr",
  "psd",
  "indd",

  // 🎵 Audio
  "mp3",
  "wav",
  "ogg",
  "flac",
  "aac",
  "m4a",
  "wma",
  "alac",
  "aiff",
  "amr",
  "mid",
  "midi",
  "opus",
  "au",
  "caf",
  "ape",
  "opus",

  // 🎥 Video
  "mp4",
  "mkv",
  "avi",
  "mov",
  "flv",
  "wmv",
  "webm",
  "mpeg",
  "mpg",
  "3gp",
  "3g2",
  "m4v",
  "ts",
  "mts",
  "asf",
  "rm",
  "rmvb",
  "vob",
  "f4v",
  "ogv",
  "m2ts",
  "mod",
  "dav",

  // 🗃️ Archive & Compression
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "bz2",
  "xz",
  "tgz",
  "tbz2",
  "txz",
  "lz",
  "lzma",
  "z",
  "cab",
  "arj",
  "ace",
  "iso",
  "dmg",
  "rpm",
  "deb",
  "pkg",
  "apk",
  "jar",

  // 💾 Disk Image
  "iso",
  "img",
  "vhd",
  "vmdk",
  "qcow2",
  "dmg",

  // 🗃️ Database & Data
  "sql",
  "db",
  "dbf",
  "mdb",
  "accdb",
  "json",
  "xml",
  "yaml",
  "yml",
  "toml",
  "ini",
  "plist",
  "yaml",
  "pkl",
  "msgpack",
  "h5",
  "hdf5",
  "parquet",
  "avro",
  "orc",
  "ndjson",
  "db",
  "pdb",
  "sqlite",
  "sqlite3",
  "dbx",
  "sdf",

  // 💻 Code & Script
  "js",
  "jsx",
  "ts",
  "tsx",
  "c",
  "cpp",
  "h",
  "hpp",
  "java",
  "py",
  "rb",
  "go",
  "rs",
  "php",
  "pl",
  "sh",
  "bat",
  "cmd",
  "ps1",
  "lua",
  "swift",
  "kt",
  "scala",
  "cs",
  "vb",
  "dart",
  "m",
  "r",
  "jl",
  "fs",
  "vbproj",
  "sln",
  "pri",
  "Makefile",

  // 🌐 Web & Config
  "html",
  "htm",
  "xhtml",
  "css",
  "scss",
  "sass",
  "less",
  "xml",
  "json",
  "yaml",
  "yml",
  "xlf",
  "xlf",
  "po",
  "pot",
  "jsp",
  "asp",
  "aspx",
  "php",
  "jspf",
  "cgi",
  "cfm",
  "pl",
  "env",
  "conf",
  "config",
  "xml",
  "ini",
  "cfg",
  "toml",
  "yaml",
  "dockerfile",
  "gitignore",
  "gitconfig",
  "gitattributes",
  "npmignore",
  "lock",
  "gradle",
  "pom",
  "yaml",
  "prettierrc",
  "eslintrc",
  "babelrc",
  "editorconfig",

  // 🔠 Font
  "ttf",
  "otf",
  "woff",
  "woff2",
  "eot",

  // 🗺️ CAD & GIS
  "dwg",
  "dxf",
  "shp",
  "kml",
  "kmz",
  "gpx",
  "stl",
  "step",
  "iges",
  "3ds",
  "3dm",
  "fbx",
  "obj",

  // 🔧 System / Binary / Execution
  "exe",
  "msi",
  "bin",
  "run",
  "com",
  "cmd",
  "apk",
  "app",
  "deb",
  "rpm",
  "elf",
  "dll",
  "so",
  "dylib",
  "sys",

  // 🔐 Certificates / Crypto
  "pem",
  "crt",
  "cer",
  "key",
  "der",
  "csr",
  "p12",
  "pfx",
  "jks",

  // 🎮 Games & Projects
  "iso",
  "cue",
  "bin",
  "nes",
  "sfc",
  "gba",
  "nds",
  "nes",
  "sav",
  "rom",
  "pak",
  "vpk",
  "bik",

  // 📚 E-books and Comics
  "epub",
  "mobi",
  "azw",
  "azw3",
  "fb2",
  "lit",
  "lrf",
  "cbr",
  "cbz",
  "cbt",
  "cba",
  "opds",

  // 🔬 Bioinformatics
  "fasta",
  "fa",
  "fas",
  "ffn",
  "faa",
  "fna",
  "frn",
  "fastq",
  "fq",
  "gb",
  "gbk",
  "sam",
  "bam",
  "vcf",
  "gff",
  "bed",

  // 📝 Etc
  "log",
  "bak",
  "tmp",
  "old",
  "backup",
  "swp",
  "part",
  "crdownload",
  "torrent",
  "ics",
  "vcf",
  "ics",
  "ical",
  "ics",
  "ical",
  "calendar",
  "srt",
  "sub",
  "idx",
  "cue",

  // 🧠 Other broad (technical & scientific extensions)
  "cdf",
  "hdf",
  "h5",
  "nc",
  "grib",
  "fits",
  "netcdf",
  "sdf",
  "vtk",
  "xmind",
  "drawio",

  // ⚙️ Packages & Plugins
  "jar",
  "war",
  "ear",
  "crx",
  "xpi",
  "plugin",
  "vsix",
  "safariextz",
]);

const DOUBLE_EXTENSIONS = new Set([
  "tar.gz",
  "tar.bz2",
  "tar.xz",
  "tar.lz",
  "tar.lzma",
  "tar.Z",
  "tar.zst",
  "tar.xz",
]);

/** ----------------------------------------------------------
 * * ***Extracts the base file name (without extension) from a given URL, file path, or file name.***
 * ----------------------------------------------------------
 *
 * - ✅ Strips known extensions (including multi-part extensions such as `.tar.gz`, `.tar.bz2`, etc.).
 * - ✅ Handles plain file names, local file paths, and full URLs seamlessly.
 * - ✅ If the path ends with a `/`, returns an empty string `""` (represents a directory or empty segment).
 * - ✅ If the input is empty, whitespace, or not a string, returns `undefined`.
 * - ✅ Leaves unknown or unrecognized extensions intact (does not attempt to strip unknown file extensions).
 *
 * Behavior summary:
 * - `extractFileName("https://example.com/file.txt")` → `"file"`
 * - `extractFileName("/local/path/image.jpeg")` → `"image"`
 * - `extractFileName("backup.archive.tar.gz")` → `"backup.archive"`
 * - `extractFileName("folder/")` → `""`
 * - `extractFileName("")` → `undefined`
 * - `extractFileName("unknownfile.weirdext")` → `"unknownfile.weirdext"` (keeps unknown extension)
 *
 * This is particularly useful for displaying or logging file names
 * without cluttering them with redundant extensions, while being careful
 * not to accidentally truncate unfamiliar formats.
 *
 * @param {string} url - The URL, file system path, or plain file name to process.
 * @returns {string | undefined} The file name without its extension(s),
 *                               or `undefined` if input is invalid,
 *                               or an empty string `""` if the path ends with `/`.
 *
 * @example
 * extractFileName("document.pdf");                     // "document"
 * extractFileName("/files/archive.tar.gz");            // "archive"
 * extractFileName("https://cdn.site.com/video.mp4");   // "video"
 * extractFileName("folder/");                          // ""
 * extractFileName("strangefile.unknownext");           // "strangefile.unknownext"
 * extractFileName("");                                 // undefined
 */
export const extractFileName = (url: string): string | undefined => {
  if (isEmptyString(url)) return undefined; // Handle invalid inputs

  let fileName = url.split("/").pop();
  if (fileName === "") return "";
  if (!fileName) return undefined;

  // Remove double extensions first
  for (const ext of DOUBLE_EXTENSIONS) {
    const fullExt = `.${ext}`;
    if (fileName.toLowerCase().endsWith(fullExt)) {
      return fileName.slice(0, -fullExt.length);
    }
  }

  // Then keep stripping known single extensions repeatedly
  while (true) {
    const lastDot = fileName.lastIndexOf(".");
    if (lastDot === -1) break;

    const ext = fileName.slice(lastDot + 1).toLowerCase();
    if (KNOWN_EXTENSIONS.has(ext)) {
      fileName = fileName.slice(0, lastDot);
    } else {
      break;
    }
  }

  return fileName;
};
