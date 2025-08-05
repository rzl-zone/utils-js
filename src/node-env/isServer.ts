/** ----------------------------------------
 * * ***Checks if the current environment is a server-side (Node.js) or a client-side (browser).***
 * ----------------------------------------
 *
 * @returns {boolean} `true` if running on the server-side, `false` if running in the client-side (browser).
 */
export const isServer = (): boolean => {
  return typeof window === "undefined" || typeof document === "undefined";
};
