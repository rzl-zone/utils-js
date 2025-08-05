import { isURL } from "./isURL";

/** ---------------------------------
 * * ***Checks if two URLs are exactly the same, including protocol, host, pathname, and query parameters.***
 * ---------------------------------
 *
 * @param {URL} urlA - The first URL to compare.
 * @param {URL} urlB - The second URL to compare.
 * @returns {boolean} Returns `true` if both URLs are identical, otherwise `false`.
 */
export const areURLsIdentical = (urlA: URL, urlB: URL): boolean => {
  if (!isURL(urlA) || !isURL(urlB)) {
    throw new TypeError(
      "Both arguments to 'areURLsIdentical' must be instances of URL."
    );
  }

  return (
    urlA.protocol + "//" + urlA.host + urlA.pathname + urlA.search ===
    urlB.protocol + "//" + urlB.host + urlB.pathname + urlB.search
  );
};
