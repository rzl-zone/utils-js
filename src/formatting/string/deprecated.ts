import { isString } from "@/index";

/** ----------------------------------------------------------
 * * Censors an email by randomly replacing characters with "*"
 * while keeping its structure recognizable.
 * ----------------------------------------------------------
 *
 * - Ensures valid email format.
 * - Handles multi-level TLDs (e.g., `co.uk`).
 * - Adapts censorship based on email length.
 * - Returns an empty string for invalid emails.
 *
 * @param {string} email - The email to be censored.
 * @returns {string} - The randomized censored email or an empty string if invalid.
 *
 * @example
 * console.log(censorEmailDeprecated("example@gmail.com"));
 * // Output: "ex*m**e@g*a*l.com"
 *
 * console.log(censorEmailDeprecated("john.doe@example.co.uk"));
 * // Output: "j*h*.d*e@e*a*p*e.co.*k"
 *
 * console.log(censorEmailDeprecated("info@company.io"));
 * // Output: "i*f*@c*m*a*y.io"
 *
 * console.log(censorEmailDeprecated("invalid-email"));
 * // Output: ""
 *
 * @deprecated Use `censorEmail` instead.
 */
export const censorEmailDeprecated = (email?: string | null): string => {
  if (!isString(email)) return "";

  // Strict email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return "";

  const [local, domain] = email.split("@");

  /**
   * Randomly replaces characters in a string with "*"
   * @param {string} str - The string to censor.
   * @param {number} minCensor - Minimum number of characters to censor.
   * @param {number} maxPercentage - Maximum percentage of characters to censor.
   * @returns {string} - Censored string.
   */
  const randomCensor = (
    str: string,
    minCensor: number = 2,
    maxPercentage: number = 0.5
  ): string => {
    if (str.length <= minCensor) return "*".repeat(str.length);

    const strArr = str.split("");
    const totalCensor = Math.max(
      minCensor,
      Math.ceil(str.length * maxPercentage)
    );

    const censoredIndexes: Set<number> = new Set();
    while (censoredIndexes.size < totalCensor) {
      censoredIndexes.add(Math.floor(Math.random() * str.length));
    }

    for (const index of censoredIndexes) {
      strArr[index] = "*";
    }

    return strArr.join("");
  };

  // Handle multi-level domain (e.g., example.co.uk)
  const domainParts = domain.split(".");
  if (domainParts.length < 2) return ""; // Invalid domain structure

  const [domainName, ...tldParts] = domainParts;
  const tld = tldParts.join(".");

  // Adaptive censorship
  const censoredLocal = randomCensor(local, local.length < 4 ? 1 : 2, 0.6);
  const censoredDomain = randomCensor(
    domainName,
    domainName.length < 4 ? 1 : 2,
    0.5
  );
  const censoredTLD = tld.length <= 2 ? tld : randomCensor(tld, 1, 0.4);

  return `${censoredLocal}@${censoredDomain}.${censoredTLD}`;
};
