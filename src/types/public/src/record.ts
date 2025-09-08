// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AnyString } from "./string";

/** --------------------------------------------------
 * * ***AnyRecord.***
 * --------------------------------------------------
 * Represents an object with arbitrary string keys and values of **any** type.
 *
 * ⚠️ Use with caution — `any` disables type safety. Prefer stricter typing when possible.
 *
 * ✅ Commonly used as a fallback for flexible key-value structures
 *    such as query parameters, configuration maps, or JSON-like data.
 *
 * @example
 * ```ts
 * const config: AnyRecord = {
 *   mode: "dark",
 *   retries: 3,
 *   debug: true,
 * };
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>;

/** --------------------------------------------------
 * * ***UnknownRecord.***
 * --------------------------------------------------
 * Represents an object with arbitrary string keys and values of **unknown** type.
 *
 * ✅ Safer alternative to `AnyRecord` — forces explicit type narrowing
 *    before values can be used, maintaining type safety.
 *
 * ✅ Suitable for working with untyped external data sources
 *    (e.g., JSON APIs, parsed configs) where values must be validated first.
 *
 * @example
 * ```ts
 * const data: UnknownRecord = JSON.parse("{}");
 *
 * // Must narrow the type before usage
 * if (typeof data.id === "string") {
 *   console.log(data.id.toUpperCase());
 * }
 * ```
 */
export type UnknownRecord = Record<string, unknown>;

/** -------------------------------------------------------
 * * ***AnyStringRecord.***
 * -------------------------------------------------------
 *
 * Same as **{@link AnyString}** but uses `Record<never, never>` as the intersection.
 * This approach is often more reliable in preserving literal types
 * in generic inference scenarios.
 *
 * @example
 * ```ts
 * declare function acceptsAnyStringRecord<T extends AnyStringRecord>(value: T): T;
 *
 * const a = acceptsAnyStringRecord("hello");
 * // ➔ "hello"
 *
 * const b = acceptsAnyStringRecord(String("world"));
 * // ➔ string
 * ```
 */
export type AnyStringRecord = Record<never, never> & string;
