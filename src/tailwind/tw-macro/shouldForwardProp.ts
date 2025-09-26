import type { Stringify } from "@rzl-zone/ts-types-plus";

import { isString } from "@/predicates/is/isString";
import { isEmptyString } from "@/predicates/is/isEmptyString";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { assertIsArray } from "@/assertions/objects/assertIsArray";

/** ----------------------------------------------------------
 * * ***Utility: `shouldForwardProp`.***
 * ----------------------------------------------------------
 * **Creates a helper for styled-components `shouldForwardProp`.**
 * @description
 * This utility returns a predicate function that determines whether a given prop
 * should be forwarded to the DOM, useful for filtering out internal props (e.g.,
 * `$size`, `$active`) so they don't end up as invalid HTML attributes.
 * - **Behavior:**
 *    - Accepts a tuple (strict) of prop keys to exclude from forwarding.
 *    - Automatically coerces prop names to string for consistent checking.
 *    - Supports string, number, or symbol keys (via PropertyKey).
 *    - Will throw an error if the provided `props` argument is not an array.
 * @template CustomProps - The type of the component's props.
 * @param {UnionToTupleStrict<keyof CustomProps>} props
 *   The list of prop names (keys of `CustomProps`) to exclude from forwarding.
 * @returns {(propName: PropertyKey) => boolean}
 *   A function that takes a prop name and returns `true` if it should be forwarded, `false` if it should be blocked.
 * @throws {TypeError} If `props` is not an array.
 * @example
 * type Props = { $size: string; color: string; visible: boolean };
 * const filter = shouldForwardProp<Props>(["$size"]);
 * filter("$size");   // ➔ false (blocked)
 * filter("color");   // ➔ true (forwarded)
 * filter("visible"); // ➔ true (forwarded)
 * @example
 * // Using with styled-components:
 * styled.div.withConfig({
 *   shouldForwardProp: shouldForwardProp<CustomProps>(["$internal"])
 * })
 */
export const shouldForwardProp = <CustomProps extends Record<string, unknown>>(
  props: readonly Stringify<keyof CustomProps>[]
  // props: Partial<UnionToTupleStrict<keyof CustomProps>>
): ((propName: keyof CustomProps | ({} & string)) => boolean) => {
  assertIsArray(props, {
    message: ({ currentType, validType }) =>
      `First parameter (\`props\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const invalidItems: { index: number; reason: string }[] = [];

  props.forEach((p, idx) => {
    if (!isString(p)) {
      invalidItems.push({
        index: idx,
        reason: `Expected a non-empty string, but received ${getPreciseType(p, {
          formatCase: "toPascalCaseSpace"
        })}.`
      });
    } else if (isEmptyString(p)) {
      invalidItems.push({
        index: idx,
        reason: `Expected a non-empty string, but received EmptyString.`
      });
    }
  });

  if (isNonEmptyArray(invalidItems)) {
    const maxWidth = Math.max(...invalidItems.map((item) => String(item.index).length));

    const details = invalidItems
      .map(
        (item) => `• [Index ${String(item.index).padStart(maxWidth, "0")}] ${item.reason}`
      )
      .join("\n");

    throw new TypeError(
      `First parameter (\`props\`) contains invalid entries:\n${details}`
    );
  }

  return (propName): boolean => {
    return !props.map(String).includes(String(propName));
  };
};
