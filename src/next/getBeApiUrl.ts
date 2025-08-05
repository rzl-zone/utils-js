import { removeSpaces, formatEnvPort, isString } from "@/index";

/** ---------------------------------
 * * ***Retrieves the base API URL of the backend.***
 * ---------------------------------
 *
 * This function determines the backend API base URL from the `NEXT_PUBLIC_BACKEND_API_URL` environment variable.
 * If the variable is not set, it defaults to `"http://localhost:8000"`.
 * It also allows adding an optional suffix to the returned URL.
 *
 * * ⚠️ ***Notes: This Function only support when using `NextJS`***
 *
 * This function determines the backend API base URL from the `NEXT_PUBLIC_BACKEND_API_URL` environment variable.
 * - If `NEXT_PUBLIC_BACKEND_API_URL` is not set, it defaults to `"http://localhost:8000"`.
 * - If `NEXT_PUBLIC_BACKEND_API_URL` does **not** contain a port, it appends one from `NEXT_PUBLIC_PORT_BE` if available.
 * - Supports appending optional suffix (like "/api").
 *
 *
 * @param {Object} options - Configuration options.
 * @param {string} [options.suffix="/"] - The suffix to append to the base API URL.
 * @returns {string} The formatted backend API base URL.
 * @throws {TypeError} If `suffix` is not a `string`.
 * @throws {Error} If `NEXT_PUBLIC_BACKEND_API_URL` is invalid.
 */
export const getBeApiUrl = ({
  suffix = "/",
}: {
  /** * The Suffix origin base api url, e.g:`http://localhost.com/api`.
   *
   * @default "/" */
  suffix?: string;
} = {}): string => {
  // Ensure suffix is a string
  if (!isString(suffix)) {
    throw new TypeError(
      `Invalid type for 'suffix'. Expected string, received: ${typeof suffix}`
    );
  }

  try {
    let rawBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL?.trim();

    if (rawBaseUrl) {
      rawBaseUrl = removeSpaces(rawBaseUrl);
      // const hasPort = /:\/\/[^/]+:\d+/.test(rawBaseUrl);
      const urlObj = new URL(rawBaseUrl);
      const hasPort = !!urlObj.port;

      if (!hasPort && process.env.NEXT_PUBLIC_PORT_BE) {
        rawBaseUrl =
          urlObj.origin +
          formatEnvPort(process.env.NEXT_PUBLIC_PORT_BE, {
            prefixColon: true,
          });
      }
    } else {
      // fallback
      rawBaseUrl =
        "http://localhost" +
        formatEnvPort(process.env.NEXT_PUBLIC_PORT_BE || "8000", {
          prefixColon: true,
        });
    }

    suffix = removeSpaces(suffix).length ? removeSpaces(suffix) : "/";
    const baseApiUrl = new URL(rawBaseUrl.replace(/\/+$/, "")).origin;

    const finalSuffix =
      suffix === "/"
        ? "/"
        : `${suffix.startsWith("/") ? "" : "/"}${suffix.replace(/\/+$/, "")}`;

    return `${baseApiUrl}${finalSuffix}`;
  } catch (error) {
    throw new Error(
      "Invalid `NEXT_PUBLIC_BACKEND_API_URL`, failed to generate from `getBeApiUrl()`, Error:" +
        error
    );
  }
};
