import type { If } from "./if";
import type { IfNot } from "./if-not";
import type { IsNever } from "./never";
import type { Trim } from "./trim";

/** -------------------------------------------------------
 * * ***AnyString.***
 * -------------------------------------------------------
 *
 * A utility type that represents **any string value** while
 * preventing unwanted widening of string literals to `string`.
 *
 * 🔹 This is achieved by intersecting `string` with `{}`,
 * ensuring that the type remains assignable to `string`
 * but is treated as a unique type in generic constraints.
 *
 * 📌 Useful in scenarios where:
 * - You want to accept **any string**, but still preserve
 *   literal types in inference.
 * - You need stricter typing than just `string`.
 *
 * @example
 * ```ts
 * declare function acceptsAnyString<T extends AnyString>(value: T): T;
 *
 * // Preserves literal
 * const a = acceptsAnyString("hello");
 * // ➔ "hello"
 *
 * // Also allows generic string
 * const b = acceptsAnyString(String("world"));
 * // ➔ string
 * ```
 */
export type AnyString = {} & string;

/** -------------------------------------------------------
 * * ***EmptyString.***
 * -------------------------------------------------------
 * Returns the type `T` only if it is the empty string `""`.
 * Optionally trims whitespace before checking.
 *
 * Behavior:
 * - If `WithTrim` is `true` (default), trims `T` before checking.
 * - If `T` is the general `string` type, returns `never`.
 * - If `T` is empty (after optional trimming), returns `T` or `Trim<T>`.
 *
 * @template T - The string type to check.
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 *
 * @example
 * ```ts
 * // Basic empty string
 * type Case1 = EmptyString<"">;
 * // ➔ ""
 *
 * // Non-empty string
 * type Case2 = EmptyString<"abc">;
 * // ➔ never
 *
 * // General string type
 * type Case3 = EmptyString<string>;
 * // ➔ never
 *
 * // With leading/trailing whitespace
 * type Case4 = EmptyString<"  ", true>;
 * // ➔ "" (trimmed)
 * type Case5 = EmptyString<"  ", false>;
 * // ➔ never (not trimmed)
 * ```
 */
export type EmptyString<T extends string, WithTrim extends boolean = true> = "" extends (
  WithTrim extends true ? Trim<T> : T
)
  ? string extends (WithTrim extends true ? Trim<T> : T)
    ? never
    : WithTrim extends true
    ? Trim<T>
    : T
  : never;

/** -------------------------------------------------------
 * * ***NonEmptyString.***
 * -------------------------------------------------------
 * Returns the type `T` only if it is a non-empty string.
 * Optionally trims whitespace before checking.
 *
 * Behavior:
 * - If `WithTrim` is `true` (default), trims `T` before checking.
 * - If `T` is the general `string` type, returns `string`.
 * - If `T` is empty (after optional trimming), returns `never`.
 *
 * @template T - The string type to check.
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 *
 * @example
 * ```ts
 * // Non-empty string
 * type Case1 = NonEmptyString<"abc">; // ➔ "abc"
 *
 * // Empty string
 * type Case2 = NonEmptyString<"">; // ➔ never
 *
 * // General string type
 * type Case3 = NonEmptyString<string>; // ➔ string
 *
 * // String with whitespace
 * type Case4 = NonEmptyString<"  ", true>; // ➔ never (trimmed to empty)
 * type Case5 = NonEmptyString<"  ", false>; // ➔ "  " (not trimmed)
 * ```
 */
export type NonEmptyString<
  T extends string,
  WithTrim extends boolean = true
> = string extends T
  ? string
  : If<IsNever<EmptyString<T, WithTrim>>, WithTrim extends true ? Trim<T> : T, never>;

/** -------------------------------------------------------
 * * ***IsEmptyString.***
 * -------------------------------------------------------
 * Returns `true` if `T` is exactly the empty string `""`.
 * Optionally trims whitespace before checking.
 *
 * Behavior:
 * - If `WithTrim` is `true` (default), trims `T` before checking.
 * - If `T` is empty after optional trimming, returns `true`.
 * - Otherwise, returns `false`.
 *
 * @template T - The string type to check.
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 *
 * @example
 * ```ts
 * type Case1 = IsEmptyString<"">;
 * // ➔ true
 * type Case2 = IsEmptyString<"abc">;
 * // ➔ false
 * type Case3 = IsEmptyString<"  ", true>;
 * // ➔ true (trimmed)
 * type Case4 = IsEmptyString<"  ", false>;
 * // ➔ false (not trimmed)
 * ```
 */
export type IsEmptyString<T extends string, WithTrim extends boolean = true> = IfNot<
  IsNever<EmptyString<T, WithTrim>>
>;

/** -------------------------------------------------------
 * * ***IsNonEmptyString.***
 * -------------------------------------------------------
 * Returns `true` if `T` is a non-empty string.
 * Optionally trims whitespace before checking.
 *
 * Behavior:
 * - If `WithTrim` is `true` (default), trims `T` before checking.
 * - Returns `true` if `T` is non-empty after optional trimming.
 * - Returns `false` if `T` is empty (after trimming if `WithTrim=true`).
 *
 * @template T - The string type to check.
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 *
 * @example
 * ```ts
 * type Case1 = IsNonEmptyString<"abc">;
 * // ➔ true
 * type Case2 = IsNonEmptyString<"">;
 * // ➔ false
 * type Case3 = IsNonEmptyString<"  ", true>;
 * // ➔ false (trimmed)
 * type Case4 = IsNonEmptyString<"  ", false>;
 * // ➔ true (not trimmed)
 * ```
 */
export type IsNonEmptyString<T extends string, WithTrim extends boolean = true> = IfNot<
  IsNever<NonEmptyString<T, WithTrim>>
>;

/** -------------------------------------------------------
 * * ***IfEmptyString.***
 * -------------------------------------------------------
 * Conditional type: returns `IfTrue` if `T` is an empty string `""`,
 * otherwise returns `IfFalse`. Optionally trims whitespace before checking.
 *
 * @template T - The string type to check.
 * @template IfTrue - Type returned if `T` is empty (default `true`).
 * @template IfFalse - Type returned if `T` is not empty (default `false`).
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 *
 * @example
 * ```ts
 * type Case1 = IfEmptyString<"">;
 * // ➔ true
 * type Case2 = IfEmptyString<"abc">;
 * // ➔ false
 * type Case3 = IfEmptyString<"", "yes", "no">;
 * // ➔ "yes"
 * type Case4 = IfEmptyString<"abc", "yes", "no">;
 * // ➔ "no"
 * type Case5 = IfEmptyString<"  ", "yes", "no", true>;
 * // ➔ "yes" (trimmed)
 * type Case6 = IfEmptyString<"  ", "yes", "no", false>;
 * // ➔ "no" (not trimmed)
 * ```
 */
export type IfEmptyString<
  T extends string,
  IfTrue = true,
  IfFalse = false,
  WithTrim extends boolean = true
> = IfNot<IsNever<EmptyString<T, WithTrim>>, IfTrue, IfFalse>;

/** -------------------------------------------------------
 * * ***IfNonEmptyString.***
 * -------------------------------------------------------
 * Conditional type: returns `IfTrue` if `T` is a non-empty string,
 * otherwise returns `IfFalse`. Optionally trims whitespace before checking.
 *
 * @template T - The string type to check.
 * @template IfTrue - Type returned if `T` is non-empty (default `true`).
 * @template IfFalse - Type returned if `T` is empty (default `false`).
 * @template WithTrim - Whether to trim whitespace before checking (default `true`).
 *
 * @example
 * ```ts
 * type Case1 = IfNonEmptyString<"abc">;
 * // ➔ true
 * type Case2 = IfNonEmptyString<"">;
 * // ➔ false
 * type Case3 = IfNonEmptyString<"abc", "yes", "no">;
 * // ➔ "yes"
 * type Case4 = IfNonEmptyString<"", "yes", "no">;
 * // ➔ "no"
 * type Case5 = IfNonEmptyString<"  ", "yes", "no", true>;
 * // ➔ "no" (trimmed)
 * type Case6 = IfNonEmptyString<"  ", "yes", "no", false>;
 * // ➔ "yes" (not trimmed)
 * ```
 */
export type IfNonEmptyString<
  T extends string,
  IfTrue = true,
  IfFalse = false,
  WithTrim extends boolean = true
> = IfNot<IsNever<NonEmptyString<T, WithTrim>>, IfTrue, IfFalse>;
