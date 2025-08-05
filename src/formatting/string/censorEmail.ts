import { isString, isUndefined } from "@/index";

/** ----------------------------------------------------------
 * * Censors an email by replacing characters with "*", with support for random or fixed mode.
 * ----------------------------------------------------------
 *
 * In "random" mode (default), characters are randomly replaced each time.
 * In "fixed" mode, censorship is deterministic based on a hash of the email,
 * resulting in the same output for the same input.
 *
 * @param email - The email to censor.
 * @param mode - Censoring mode: "random" or "fixed". Default is "random".
 * @returns The censored email or an empty string if invalid.
 *
 * @example
 * censorEmail("john.doe@gmail.com", "random"); // -> j***.d*@g***l.com (varies)
 * censorEmail("john.doe@gmail.com", "fixed");  // -> j**n.**e@g***l.com (always the same)
 * censorEmail("invalid-email");                // -> ""
 */
export const censorEmail = (
  email?: string | null,
  mode: "random" | "fixed" = "random"
): string => {
  if (!isString(email)) return "";

  // Ensure mode is either "random" or "fixed"
  if (mode !== "random" && mode !== "fixed") {
    throw new TypeError(
      "Expected 'mode' to be a 'string' and the valid value is 'random' and 'fixed' only!"
    );
  }

  // Strict email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "";

  const [local, domain] = email.split("@");
  const domainParts = domain.split("."); // Handle multi-level domain (e.g., example.co.uk)
  if (domainParts.length < 2) return ""; // Invalid domain structure

  const [domainName, ...tldParts] = domainParts;
  const tld = tldParts.join(".");

  const hashSeed =
    mode === "fixed"
      ? (() => {
          let hash = 0;
          for (let i = 0; i < email.length; i++) {
            hash = (hash << 5) - hash + email.charCodeAt(i);
            hash |= 0; // Convert to 32bit int
          }
          return Math.abs(hash);
        })()
      : undefined;

  /**
   * Randomly replaces characters in a string with "*"
   * @param {string} str - The string to censor.
   * @param {number} minCensor - Minimum number of characters to censor.
   * @param {number} maxPercentage - Maximum percentage of characters to censor.
   * @returns {string} - Censored string.
   */
  const censor = (
    str: string,
    minCensor: number,
    maxPercentage: number
  ): string => {
    if (str.length <= minCensor) return "*".repeat(str.length);

    const strArr = str.split("");
    const totalCensor = Math.max(
      minCensor,
      Math.ceil(str.length * maxPercentage)
    );
    const indexes = new Set<number>();

    let i = 0;
    while (indexes.size < totalCensor) {
      const idx = !isUndefined(hashSeed)
        ? (hashSeed + str.length + i * 31) % str.length
        : Math.floor(Math.random() * str.length);
      indexes.add(idx);
      i++;
    }

    for (const index of indexes) {
      strArr[index] = "*";
    }

    return strArr.join("");
  };

  const censoredLocal = censor(local, local.length < 4 ? 1 : 2, 0.6);
  const censoredDomain = censor(domainName, domainName.length < 4 ? 1 : 2, 0.5);
  const censoredTLD = tld.length <= 2 ? tld : censor(tld, 1, 0.4);

  return `${censoredLocal}@${censoredDomain}.${censoredTLD}`;
};
