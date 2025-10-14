import { punycodeUtilsJS } from "@/urls/utils/punyCode";

import sldMap from "./_private/data/domain/sldMap.json";
import ccTldMap from "./_private/data/domain/ccTldMap.json";

import { isPlainObject } from "./isPlainObject";

/** ---------------------------------------------------------
 * * ***Options for `isValidDomain` predicate.***
 * ---------------------------------------------------------
 * **Customize the behavior of domain validation.**
 */
type IsValidDomainOptions = {
  /**
   * Enable conversion of Unicode domains (IDN) to ASCII (punycode).
   * - Example: `"пример.рф"` ➔ `"xn--e1afmkfd.xn--p1ai"`
   * - Allows validating Unicode domains correctly.
   * - Default: `false`
   */
  allowUnicode?: boolean;

  /**
   * If `true`, validates **only top-level domains (TLDs)** that are not part of any SLD/second-level domain.
   * - Accepts country-code TLDs like `"ai"` or `"ai."` ✅
   * - Rejects common TLDs that are part of SLDs like `"com"` ❌
   * - Only the final label is checked; subdomains are ignored.
   * - Default: `false`
   */
  topLevel?: boolean;

  /**
   * Allow or disallow subdomains.
   * - Example: `"sub.example.com"` ✅ if `subdomain` is `true`, ❌ if `false`
   * - Wildcards and SLDs are considered when evaluating subdomains.
   * - Default: `true`
   */
  subdomain?: boolean;

  /**
   * Allow a wildcard `*` in the left-most label.
   * - Example: `"*.example.com"` ✅ if `wildcard` is `true`, ❌ if `false`
   * - Wildcards are only valid in the first label and require at least one additional label.
   * - Default: `false`
   */
  wildcard?: boolean;
};

/** ---------------------------------------------------------
 * * ***Predicate: `isValidDomain`.***
 * ---------------------------------------------------------
 * **Validates whether a given string is a properly formatted domain name.**
 *
 * - **Supports options for:**
 *    - `allowUnicode` ➔ allows internationalized domain names (IDN) with Unicode characters.
 *    - `topLevel` ➔ validates **only top-level domains (TLDs)**; ignores subdomains and SLDs.
 *    - `subdomain` ➔ allows or disallows subdomains.
 *    - `wildcard` ➔ allows wildcard (`*`) in the left-most label.
 *
 * - **Behavior:**
 *    - ✅ Converts Unicode to ASCII (punycode) if `allowUnicode` is `true`.
 *    - ✅ Checks label lengths (≤63 chars), valid characters, and punycode consistency.
 *    - ❌ Rejects invalid domains, labels starting/ending with `-`, double dots, or malformed TLDs.
 *    - ✅ Handles both standard domains (example.com) and IDNs (пример.рф).
 *
 * @param {*} value - The value to validate; only strings are valid domains.
 * @param {IsValidDomainOptions} [options] - Optional configuration for domain validation.
 * @param {boolean} [options.allowUnicode=false] - Enable punycode conversion for Unicode domains.
 * @param {boolean} [options.topLevel=false] - Validate only TLDs (e.g., `ai`, `uk.`); ignores SLDs like `com`.
 * @param {boolean} [options.subdomain=true] - Allow subdomains; set `false` to reject any subdomain.
 * @param {boolean} [options.wildcard=false] - Allow wildcard `*` in the left-most label (e.g., `*.example.com`).
 * @returns {boolean} Returns `true` if the value is a valid domain according to the rules and options; otherwise `false`.
 *
 * @example
 * isValidDomain("google.com");
 * // ➔ true
 *
 * isValidDomain("пример.рф", { allowUnicode: true });
 * // ➔ true
 *
 * isValidDomain("sub.example.com", { subdomain: false });
 * // ➔ false
 *
 * isValidDomain("*.example.com", { wildcard: true });
 * // ➔ true
 *
 * isValidDomain("com", { topLevel: true });
 * // ➔ false (common TLD rejected because it's part of SLD)
 *
 * isValidDomain("ai.", { topLevel: true });
 * // ➔ true (country-code TLD accepted)
 *
 * isValidDomain("invalid_domain.com");
 * // ➔ false
 */
export function isValidDomain(
  value: unknown,
  options: IsValidDomainOptions = {}
): boolean {
  if (typeof value !== "string") return false;
  if (!isPlainObject(options)) options = {};
  let _value = value.toLowerCase();

  if (value.endsWith(".")) {
    _value = _value.slice(0, _value.length - 1);
  }

  if (options.allowUnicode) {
    try {
      _value = punycodeUtilsJS.toASCII(_value);
    } catch {
      return false;
    }
  }

  if (_value.length > 253) return false;

  const validChars = /^([\u0E00-\u0E7Fa-z0-9-._*]+)$/g;
  if (!validChars.test(_value)) return false;

  if (options.topLevel) {
    if (ccTldMap[_value.replace(/\.$/, "") as keyof typeof ccTldMap]) {
      return true;
    }
  }

  const sldRegex = /(.*)\.(([\u0E00-\u0E7Fa-z0-9]+)(\.[a-z0-9]+))/;
  const matches = _value.match(sldRegex);
  let tld: string | null = null;
  let labels: string[] | null = null;

  if (matches && matches.length > 2) {
    if (sldMap[matches[2] as keyof typeof sldMap]) {
      tld = matches[2];
      labels = matches[1].split(".");
    }
  }

  if (!labels) {
    labels = _value.split(".");
    if (labels.length <= 1) return false;

    tld = labels.pop()!;
    const tldRegex = /^(?:xn--)?(?!^\d+$)[\u0E00-\u0E7Fa-z0-9]+$/gi;
    if (!tldRegex.test(tld)) return false;
  }

  if (options.subdomain === false && labels.length > 1) return false;

  return labels.every((label, index) => {
    if (options.wildcard && index === 0 && label === "*" && labels.length > 1) {
      return true;
    }

    let validLabelChars = /^([\u0E00-\u0E7Fa-zA-Z0-9-_]+)$/g;
    if (index === labels.length - 1) {
      validLabelChars = /^([\u0E00-\u0E7Fa-zA-Z0-9-]+)$/g;
    }

    const doubleDashCount = (label.match(/--(--)?/g) || []).length;
    const xnDashCount = (label.match(/xn--/g) || []).length;
    if (index === labels.length - 1 && doubleDashCount !== xnDashCount) {
      return false;
    }

    return (
      validLabelChars.test(label) &&
      label.length < 64 &&
      !label.startsWith("-") &&
      !label.endsWith("-")
    );
  });
}
