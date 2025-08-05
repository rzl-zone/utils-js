import "server-only";
import { NextRequest } from "next/server";
import { isBoolean, isFunction } from "@/predicates";

/** ---------------------------------
 * * ***Retrieves the real client IP address and constructs the full URL using headers like***
 * ***`x-forwarded-for`, `x-forwarded-proto`, and `x-forwarded-port`.***
 * ---------------------------------
 *
 * * ⚠️ **Notes:**
 *   - Only supported in **Next.js** environments (specifically in `server-only` contexts).
 *   - Should be used in **middleware** or **server actions** that have access to `NextRequest`.
 *
 *
 * @param {NextRequest} request - The incoming Next.js request object.
 * @param {boolean} [includeFullUrl=true] - Whether to return the full URL (`protocol://ip:port`) or just the IP address.
 *
 * @returns {string} The extracted client IP address or the full constructed URL.
 *
 * @throws {Error} If the function is used outside a Next.js server environment.
 * @throws {TypeError} If the arguments do not match the expected types.
 *
 * @example
 * // Basic usage in Next.js middleware
 * import { NextRequest } from "next/server";
 * import { getClientIpOrUrl } from "@rzl-zone/utils-js/next/server";
 *
 * export function middleware(request: NextRequest) {
 *   const clientIp = getClientIpOrUrl(request, false);
 *   console.log("Client IP:", clientIp);
 * }
 *
 * @example
 * // Get full URL
 * const url = getClientIpOrUrl(request);
 * console.log("Client full URL:", url);
 */
export const getClientIpOrUrl = (
  /** * The incoming Next.js request object. */
  request: NextRequest,
  /** * Whether to return the full URL (protocol, IP, and port) or just the IP address.
   *
   * @default true
   */
  includeFullUrl: boolean = true
): string => {
  // Ensure we're in a Next.js edge/server environment
  if (!isFunction(NextRequest)) {
    throw new Error(
      "`getClientIpOrUrl` is designed to be used in a `Next.js` environment."
    );
  }

  if (!(request instanceof NextRequest)) {
    throw new TypeError(
      "Argument `request` must be an instance of NextRequest."
    );
  }

  if (!isBoolean(includeFullUrl)) {
    throw new TypeError("Expected `includeFullUrl` to be a boolean.");
  }

  const forwardedIps = (request.headers.get("x-forwarded-for") ?? "127.0.0.1")
    .trim()
    .split(",");

  // Normalize IPv6 loopback addresses
  if (forwardedIps[0] === "::ffff:127.0.0.1" || forwardedIps[0] === "::1") {
    forwardedIps[0] = "127.0.0.1";
  }

  // Get the last non-empty IP from the list (more reliable for real client IP)
  const clientIp =
    forwardedIps.length > 1
      ? forwardedIps[forwardedIps.length - 1].trim()
      : forwardedIps[0];

  if (!includeFullUrl) {
    return clientIp;
  }

  // Construct full URL using protocol, IP, and port
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  // const protocol = "http";
  const port = request.headers.get("x-forwarded-port") || "3000";

  return `${
    process.env.NODE_ENV == "production" ? protocol : "http"
  }://${clientIp}:${port}`;
};
