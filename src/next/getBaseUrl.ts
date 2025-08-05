import { removeSpaces, formatEnvPort } from "@/index";

/** ---------------------------------
 * * ***Retrieves the base URL of the application.***
 * ---------------------------------
 *
 * This function is designed to be used within Next.js applications.
 * It determines the base URL from the `NEXT_PUBLIC_BASE_URL` environment variable.
 *
 * * ⚠️ ***Notes: This Function only support when using `NextJS`***
 *
 * - If `NEXT_PUBLIC_BASE_URL` is not set, it defaults to `"http://localhost:3000"`.
 * - If `NEXT_PUBLIC_BASE_URL` does **not** contain a port, it appends one from `NEXT_PUBLIC_PORT_FE` if available.
 * - Ensures the final URL is valid and normalized (no trailing slashes).
 *
 * @returns {string} The resolved base URL of the application.
 * @throws {Error} If the constructed URL is invalid or malformed.
 *
 */
export const getBaseUrl = (): string => {
  try {
    const baseEnv = process.env.NEXT_PUBLIC_BASE_URL?.trim();
    const portEnv = process.env.NEXT_PUBLIC_PORT_FE?.trim();

    let baseUrl = baseEnv || "http://localhost";

    // Always clean trailing slashes first
    baseUrl = removeSpaces(baseUrl).replace(/\/+$/, "");

    // Check if already contains port
    const hasPort = /:\/\/[^/]+:\d+/.test(baseUrl);

    if (!hasPort && portEnv) {
      baseUrl += formatEnvPort(portEnv, { prefixColon: true });
    } else if (!hasPort && !baseEnv) {
      baseUrl += ":3000";
    }

    const url = new URL(baseUrl);
    return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}`;
  } catch (error) {
    throw new Error(
      "Invalid `NEXT_PUBLIC_BASE_URL`, failed to generate from `getBaseUrl()`, Error:" +
        error
    );
  }
};
