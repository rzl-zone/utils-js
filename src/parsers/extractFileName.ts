import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import {
  DOUBLE_EXTENSIONS_FILE,
  EXTENSIONS_FILE,
  SPECIAL_FILENAMES
} from "./_private/extensions";

import { punycodeUtilsJS } from "@/urls/utils/punyCode";

import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

export type ExtractFileNameOptions = {
  /** ----------------------------------------------------------
   * * ***Indicates whether the input should be treated as a potential domain string.***
   * ----------------------------------------------------------
   *
   * - Behavior when `true`:
   *    - The `domainName` option is required and must be a string and non-empty string.
   *      If `domainName` is `undefined`, `null`, or an empty string, a `TypeError` will be thrown.
   *    - The `domainName` is used to determine if the input is a domain-only string.
   *    - Returns `null` if the input exactly matches `domainName` or any of its subdomains **and** has no additional path or filename.
   *    - If the input does not match `domainName` or its subdomains, it will be processed as a regular file-like name.
   *    - Supports **Unicode/IDN domains** (e.g., `tést-ドメイン.com`) and **ASCII filenames**, mixed safely.
   *
   * @default false
   */
  domainAware?: boolean;

  /** ----------------------------------------------------------
   * * ***The base domain name used for comparison (e.g., `"example.com"`).***
   * ----------------------------------------------------------
   *
   * - Required when `domainAware` is `true`.
   *    - Helps differentiate between a domain-only input (ignored) and a standalone file-like string (processed normally).
   *    - Must be a string and non-empty string. Invalid values (`undefined`, `null`, or empty string) will trigger a `TypeError`.
   *    - Works with both **ASCII domains** and **Unicode/IDN domains**.
   *    - Example:
   *      ```ts   *
   *      // ASCII domain + ASCII filename
   *      extractFileName("resume.com", {
   *        domainAware: true,
   *        domainName: "example.com"
   *      });
   *      // ➔ "resume"
   *      extractFileName("example.com", {
   *        domainAware: true,
   *        domainName: "example.com"
   *      });
   *      // ➔ null (because input is treated as domain-name)
   *
   *      // Unicode domain + ASCII filename
   *      extractFileName("tést-ドメイン.com/file.txt", {
   *        domainAware: true,
   *        domainName: "ドメイン.com"
   *      });
   *      // ➔ "file"
   *
   *      // Unicode domain + Unicode filename
   *      extractFileName("tést-ドメイン.com/ファイル名.pdf", {
   *        domainAware: true,
   *        domainName: "ドメイン.com"
   *      });
   *      // ➔ "ファイル名"
   *
   *      // Invalid domainName, will throw TypeError
   *      extractFileName("resume.com", {
   *        domainAware: true,
   *        domainName: ""
   *      });
   *      // ➔ TypeError
   *      ```
   *
   * @default undefined
   */
  domainName?: string;
};

/** ----------------------------------------------------------
 * * ***Utility: `extractFileName`.***
 * ----------------------------------------------------------
 *
 * **Extracts the **clean base filename** from nearly any input string, including URLs, local file paths,
 * UNC paths, and plain filenames.**
 *
 * - It automatically safely handles extracts the **base file name** (without extension) from:
 *    - File system paths (Windows, Unix, UNC)
 *    - Protocols like http, https, ftp, file, mailto, or custom schemes
 *    - Percent-encoded, Unicode, and emoji characters
 *    - Dotfiles, reserved OS names, multi-part extensions
 *    - Data URIs
 *    - Optional domain-aware mode to ignore domain-only inputs
 *    - Plain filenames
 *
 * - Full support for:
 *    - Unicode, emoji, percent-encoding
 *    - Dotfiles (e.g., `.env`, `.gitignore`)
 *    - Reserved/OS-protected filenames:
 *      `CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9`
 *    - Known multi-part extensions:
 *      `.tar.gz`, `.tar.bz2`, `.tar.xz`, `.tar.lz`, `.tar.zst`, `.min.js`, `.js.map`, `.log.gz`, `.sql.gz`,
 *      `.backup.tar`, etc.
 *    - Data URIs (`data:[mime];base64,...` ➔ payload string)
 *    - Domain-aware mode (optional)
 *
 * ----------------------------------------------------------
 * - **Behavior / Features**
 *    - Strips **known extensions**, including multi-part and common double/triple extensions.
 *    - Leaves unknown/custom extensions intact.
 *    - Preserves **dotfiles** as-is (leading dot preserved).
 *    - Returns `null` if:
 *      - input is `null`, `undefined`, or not a string
 *      - input is empty, whitespace-only, or only slashes
 *      - input represents a folder path (trailing slash/backslash, drive/folder only)
 *    - input is a **domain-only string** in domain-aware mode
 *    - Normalizes Windows-style backslashes (`\`) internally as `/`.
 *    - Supports UNC paths, mixed slashes, and Windows drive letters safely.
 *    - Handles URLs:
 *      - Ignores query strings (`?v=1.2.3`) and hash fragments (`#section`)
 *      - Decodes percent-encoded filenames (`my%20file.txt` ➔ `my file.txt`)
 *      - Supports protocol-relative URLs (`//cdn.example.com/file.jpg`)
 *      - Supports uncommon/custom protocols (`ftp://`, `file://`, `mailto:`, etc.)
 *    - Handles **multiple dots**, **trailing dots**, **triple or more extensions**
 *    - Supports filenames on mixed Unicode/ASCII domains:
 *      - Domain names can include Unicode characters (IDN / punycode)
 *      - Filenames may contain ASCII, Unicode, and emoji characters
 *      - Works correctly when domain is Unicode and filename is ASCII, or vice versa
 *    - Supports extremely long filenames safely (up to OS limits)
 *    - Domain-aware mode (`domainAware: true` + `domainName`):
 *      - Parameter `domainName` must be a string and non-empty string; otherwise a TypeError is thrown.
 *      - Returns `null` if input equals `domainName` or any subdomain with no file path
 *      - Extracts filename normally if path/file exists on domain or other domain
 *    - Safe in Node.js and browsers
 *
 * ----------------------------------------------------------
 * @param {string | null | undefined} input
 *   URL, file path, or plain filename to extract from.
 *
 * @param {ExtractFileNameOptions} [options]
 *   Optional configuration:
 *   - `domainAware?: boolean` – treat input as a domain string. Requires `domainName` to be a string and non-empty string; otherwise, a TypeError is thrown.
 *   - `domainName?: string` – base domain for comparison eg (`example.com`), required when `domainAware` is true.
 *
 * @returns {string | null}
 *   - Base filename without known extensions
 *   - Original filename if extension unknown
 *   - `null` for invalid inputs, folder paths, or domain-only strings
 *
 * ----------------------------------------------------------
 * @example
 * ```ts
 * // Basic files
 * extractFileName("document.pdf"); // ➔ "document"
 * extractFileName("/files/archive.tar.gz"); // ➔ "archive"
 * extractFileName("C:\\path\\file.txt"); // ➔ "file"
 * extractFileName(".env"); // ➔ ".env"
 * extractFileName("folder/"); // ➔ null
 *
 * // Not a file
 * extractFileName("not-file"); // ➔ null
 * extractFileName("not-file/"); // ➔ null
 * extractFileName("/not-file/"); // ➔ null
 * extractFileName("/not-file"); // ➔ null
 *
 * // URLs with queries, hashes, protocols
 * extractFileName("https://example.com/file.txt?ver=1"); // ➔ "file"
 * extractFileName("https://example.com/archive.tar.gz#part"); // ➔ "archive"
 * extractFileName("//cdn.example.com/image.png"); // ➔ "image"
 *
 *
 * // Special protocol handling
 * extractFileName("tel:+6212345678"); // ➔ "+6212345678"
 * extractFileName("sms:+6212345678"); // ➔ "+6212345678"
 * extractFileName("mailto:user@domain.com"); // ➔ "user@domain"
 * extractFileName("data:text/plain;base64,SGVsbG8="); // ➔ "SGVsbG8="
 * extractFileName("mailto:resume.com"); // ➔ "resume"
 * extractFileName("ftp://example.com/image.jpeg"); // ➔ "image"
 * extractFileName("ftp://files.example.com/app.min.js"); // ➔ "app.min"
 * extractFileName("file:///C:/path/to/document.pdf"); // ➔ "document"
 * extractFileName("custom-scheme://example.com/video.mp4"); // ➔ "video"
 *
 * // Unicode & emoji
 * extractFileName("emoji-😊.png"); // ➔ "emoji-😊"
 * extractFileName("🔥project.tar.gz"); // ➔ "🔥project"
 *
 * // Dotfiles
 * extractFileName(".gitignore"); // ➔ ".gitignore"
 * extractFileName("/path/.bashrc"); // ➔ ".bashrc"
 *
 * // Mixed Unicode domain and ASCII filename
 * extractFileName("https://tést-ドメイン.com/file.txt"); // ➔ "file"
 * extractFileName("https://example.com/ファイル名.pdf");    // ➔ "ファイル名"
 * extractFileName("https://ドメイン例.com/emoji-🔥.png"); // ➔ "emoji-🔥"
 *
 * // Reserved filenames
 * extractFileName("CON"); // ➔ "CON"
 * extractFileName("NUL.txt"); // ➔ "NUL"
 *
 * // Domain-aware mode
 * extractFileName("example.com", {
 *    domainAware: true,
 *    domainName: "example.com"
 * });
 * // ➔ null
 * extractFileName("cdn.example.com", {
 *    domainAware: true,
 *    domainName: "example.com"
 * });
 * // ➔ null
 * extractFileName("resume.com", {
 *    domainAware: true,
 *    domainName: "example.com"
 * });
 * // ➔ "resume"
 * extractFileName("https://example.com/file.txt", {
 *    domainAware: true,
 *    domainName: "example.com"
 * });
 * // ➔ "file"
 *
 * // Windows & UNC paths
 * extractFileName("C:\\Users\\rzl\\Documents\\file.txt"); // ➔ "file"
 * extractFileName("\\\\SERVER\\share\\logs\\output.log"); // ➔ "output"
 * extractFileName("C:/Users\\rzl/mix\\test.pdf"); // ➔ "test"
 *
 * // Edge / extreme cases
 * extractFileName("https://example.com/my%20file%20name.txt"); // ➔ "my file name"
 * extractFileName("app.min.js.map"); // ➔ "app.min"
 * extractFileName("backup.tar.bak"); // ➔ "backup.tar.bak" (unknown double extension)
 * extractFileName("filename."); // ➔ "filename."
 * extractFileName("a".repeat(255) + ".txt"); // ➔ "a".repeat(255)
 * ```
 *
 * ----------------------------------------------------------
 * @note
 * - Robust: never throws, handles unusual inputs safely.
 * - Suitable for display, logging, or safe storage.
 * - Normalizes slashes consistently.
 * - Covers nearly all real-world filename, URL, path, data URI, and domain scenarios.
 * - Handles Windows UNC paths, mixed slashes, percent-encoded, Unicode/emoji filenames.
 * - Known multi-part extensions list can be extended without breaking functionality.
 */
export const extractFileName = (
  input?: string | null,
  options: ExtractFileNameOptions = {}
): string | null => {
  if (!isNonEmptyString(input)) return null;

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const { domainName, domainAware = false } = options;

  assertIsBoolean(domainAware, {
    message: ({ currentType, validType }) =>
      `Parameter \`domainAware\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  let pathname = input.trim();

  // Normalize Windows backslashes
  pathname = pathname.replace(/\\/g, "/");

  // domain-aware mode
  if (domainAware) {
    if (!isNonEmptyString(domainName)) {
      throw new TypeError(
        `If parameter \`domainAware\` is set to \`true\`, the option parameter \`domainName\` is required as string, and cant be an empty-string.`
      );
    }

    const cleanDomain = punycodeUtilsJS
      .toASCII(domainName)
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "")
      .toLowerCase();

    const inputDomain = punycodeUtilsJS
      .toASCII(input)
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./, "")
      .toLowerCase();

    const inputHost = inputDomain.split("/")[0].split(/[?#]/)[0];
    const matchesDomain =
      inputHost === cleanDomain || inputHost.endsWith(`.${cleanDomain}`);
    const hasPath = /\/[^/]+$/.test(inputDomain);

    if (matchesDomain && !hasPath) return null;
  }

  // handle special protocol-like strings
  const protocolMatch = pathname.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):(.+)$/);
  if (protocolMatch) {
    const scheme = protocolMatch[1].toLowerCase();
    const rest = protocolMatch[2];

    if (["tel", "sms"].some((sch) => sch.startsWith(scheme))) {
      const clean = rest.split("?")[0].split("#")[0];
      return clean.trim() || null;
    } else if (scheme === "mailto") {
      const parts = rest.split("/");
      let last = parts[parts.length - 1];
      last = last.split("?")[0].split("#")[0]; // strip query/hash
      const dotIndex = last.lastIndexOf(".");
      if (dotIndex > 0) last = last.slice(0, dotIndex);
      return last || null;
    } else if (scheme === "data") {
      const commaIndex = rest.indexOf(",");
      if (commaIndex === -1) return null;
      let payload = rest.slice(commaIndex + 1);
      payload = payload.split("?")[0].split("#")[0]; // strip query/hash
      return payload.trim() || null;
    }

    // switch (scheme) {
    //   case "tel":
    //     return rest.trim() || null;
    //   case "data": {
    //     const commaIndex = rest.indexOf(",");
    //     return commaIndex !== -1 ? rest.slice(commaIndex + 1).trim() || null : null;
    //   }
    //   default:
    //     break;
    // }
  }

  if (/^[a-z][a-z\d+\-.]*:\/{3,}/i.test(pathname)) {
    // eg https:///file.txt (has more than 2 slash after : protocol)
    pathname = pathname.replace(/^[a-z][a-z\d+\-.]*:\/{2,}/i, "");
  } else {
    try {
      const isProbablyUrl = /^[a-z][a-z\d+\-.]*:(\/\/)?/i.test(pathname);

      pathname = isProbablyUrl
        ? new URL(pathname).pathname
        : new URL(`http://localhost/${pathname}`).pathname;
    } catch {
      // Fallback for weird URLs like 'https:///file.txt'
      // Remove protocol + any number of slashes
      pathname = pathname.replace(/^[a-z][a-z\d+\-.]*:(\/\/)?/i, "");
    }
  }

  // split into non-empty segments
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  // Take the last segment as candidate filename
  let lastSegment = segments[segments.length - 1].split("?")[0].split("#")[0];
  // Strip trailing ? or # that is alone
  lastSegment = lastSegment.replace(/[?#]+$/, "");
  if (!lastSegment) return null;

  // Replace encoded slashes and dots
  lastSegment = lastSegment
    .replace(/%2F/gi, "/")
    .replace(/%5C/gi, "\\")
    .replace(/%2E/gi, ".");

  // If replacement introduces new slashes, take the new last segment
  if (lastSegment.includes("/")) {
    const parts = lastSegment.split("/").filter(Boolean);
    lastSegment = parts[parts.length - 1];
  }

  let filename = decodeURIComponent(lastSegment);

  if (!filename) return null;

  // Special filenames always returned as-is (even if trailing slash)
  if (SPECIAL_FILENAMES.has(filename)) return filename;

  // Dotfiles like ".env" should be returned as-is (single leading dot, no other dot)
  if (/^\.[^.\s][^/]*$/.test(filename)) return filename;

  // If the original pathname ends with "/" and the last segment doesn't look like a file
  // const originalEndsWithSlash = pathname.endsWith("/");
  if (!filename.includes(".")) return null;

  // Strip double extensions first
  const sortedDouble = [...DOUBLE_EXTENSIONS_FILE].sort((a, b) => b.length - a.length);
  for (const ext of sortedDouble) {
    const dotExt = `.${ext.toLowerCase()}`;
    if (filename.toLowerCase().endsWith(dotExt)) {
      filename = filename.slice(0, filename.length - dotExt.length);
      break;
    }
  }

  // Strip single extensions
  const sortedSingle = [...EXTENSIONS_FILE].sort((a, b) => b.length - a.length);
  for (const ext of sortedSingle) {
    const dotExt = `.${ext.toLowerCase()}`;
    if (filename.toLowerCase().endsWith(dotExt)) {
      filename = filename.slice(0, filename.length - dotExt.length);
      break;
    }
  }

  return filename || null;
  // return filename.includes(".") ? filename : null;
};
