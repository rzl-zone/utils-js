/** ----------------------------------------
 * * ***Utility: `isServer`.***
 * ----------------------------------------
 * **Checks if the current execution environment is at **server-side** (Node.js)
 * or **client-side** (browser).**
 * @returns {boolean}
 * - `true` ➔ running on the **server-side** (Node.js).
 * - `false` ➔ running on the **client-side** (browser).
 * @example
 * if (isServer()) {
 *   console.log("Running on Node.js");
 * } else {
 *   console.log("Running in the browser");
 * }
 */
export const isServer = (): boolean => {
  return typeof window === "undefined" || typeof document === "undefined";
};
