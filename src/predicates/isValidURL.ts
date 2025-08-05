import { isEmptyString } from "./isEmptyString";
import { isString } from "./isString";

/** ---------------------------------
 * * ***Validates whether a given string is a properly formatted URL.***
 * ---------------------------------
 *
 * This function checks if the input string follows a valid URL format,
 * including `http` or `https` protocols.
 *
 * @param {string} [url] - The URL string to validate.
 * @returns {boolean} `true` if the URL is valid, otherwise `false`.
 */
export const isValidURL = (url?: string | null): boolean => {
  if (!isString(url) || isEmptyString(url)) return false;

  // Regular expression to validate the structure of the URL (after decoding),
  // and it now supports subdomains as well.
  // const urlPattern = new RegExp(
  //   /^(https?:\/\/(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z0-9]{2,6})(?:\/[^\s]*)?(?:\?[^\s]*)?(?:#[^\s]*)?$/i
  // );

  // Attempt to decode the entire URL, including domain and query parameters
  let decodedUrl: string;

  try {
    // Decode the URL (to handle cases like https%3A%2F%2F becoming https://)
    decodedUrl = decodeURIComponent(url);
  } catch {
    // If decoding fails, return false as it indicates an invalid encoded URL
    return false;
  }

  // Check if the decoded URL starts with http:// or https://
  if (!decodedUrl.startsWith("http://") && !decodedUrl.startsWith("https://")) {
    return false;
  }

  // the original more extra
  const urlPattern = new RegExp(
    // /^https?:\/\/(?:localhost(?::\d+)?(?:[/?#][^\s]*)?|(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})(?:[/?#][^\s]*)?$/
    // eslint-disable-next-line no-useless-escape
    /^https?:\/\/(?:localhost(?::\d+)?(?:[\/?#][^\s]*)?|(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}(?::\d+)?(?:[\/?#][^\s]*)?)$/
    // /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/
  );

  // Test the decoded URL against the regex pattern
  return urlPattern.test(decodedUrl);
};
