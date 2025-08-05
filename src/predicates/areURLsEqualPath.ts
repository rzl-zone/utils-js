import { isURL } from "./isURL";

/** ---------------------------------
 * * ***Checks if two URLs are the same, ignoring query parameters.***
 * ---------------------------------
 *
 * This function compares only the protocol, host, and pathname.
 *
 * @param {URL} urlA - The first URL to compare.
 * @param {URL} urlB - The second URL to compare.
 * @returns {boolean} Returns `true` if both URLs are the same (ignoring search parameters), otherwise `false`.
 */
export const areURLsEqualPath = (urlA: URL, urlB: URL): boolean => {
  if (!isURL(urlA) || !isURL(urlB)) {
    throw new TypeError(
      "Both arguments to 'areURLsEqualPath' must be instances of URL."
    );
  }

  return (
    urlA.protocol + "//" + urlA.host + urlA.pathname ===
    urlB.protocol + "//" + urlB.host + urlB.pathname
  );
};
