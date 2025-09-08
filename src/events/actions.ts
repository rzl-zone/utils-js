import type { ScrollToTopOptions } from "@/types/private";

import { isServer } from "@/env/isServer";
import { isNumber } from "@/predicates/is/isNumber";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import { assertIsString } from "@/assertions/strings/assertIsString";

/** ----------------------------------------------------------
 * * ***Utility: `disableUserInteraction`.***
 * ----------------------------------------------------------
 * **Disables user interaction by adding a CSS class to the `<html>` element.**
 * - **Key points**:
 *    - Works **only in browser environments**.
 *    - Safely adds the specified CSS class to `<html>`.
 *    - Prevents multiple additions of the same class.
 *    - Useful to indicate that a process is ongoing
 *   (e.g., loading or processing state).
 * - **Using custom CSS classes:**
 *    - You can pass any class name that exists in your CSS.
 *    - Example: if you have `.loading` in your styles, passing `"loading"`
 *   will add it and disable interactions accordingly.
 * - **Validation:**
 *    - Throws `TypeError` if the `className` parameter is not a string.
 * @param {string} [className="on_processing"] - The CSS class to add, defaults to `"on_processing"`.
 * @returns {void} Does not return anything.
 * @throws {TypeError} If `className` is not a string.
 * @example
 * disableUserInteraction();          // ➔ Adds "on_processing" class
 * disableUserInteraction("loading"); // ➔ Adds "loading" class
 * // ❌ Invalid value:
 * disableUserInteraction(123);       // ➔ Throws TypeError
 */
export const disableUserInteraction = (className: string = "on_processing"): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  assertIsString(className, {
    message({ validType, currentType }) {
      return `First parameter \`className\` must be of type \`${validType}\`, but received: \`${currentType}\`.`;
    }
  });

  const { documentElement } = document;

  if (documentElement && !documentElement.classList.contains(className)) {
    documentElement.classList.add(className);
  }
};

/** ----------------------------------------------------------
 * * ***Utility: `enableUserInteraction`.***
 * ----------------------------------------------------------
 * **Enables user interaction by removing a CSS class from the `<html>` element.**
 * - **Key points**:
 *    - Works **only in browser environments**.
 *    - Safely removes the specified CSS class from `<html>`.
 *    - Does nothing if the class is not present.
 *    - Useful to re-enable user interactions after a process
 *   (e.g., loading or processing) completes.
 * - **Using custom CSS classes:**
 *    - You can pass any class name that exists in your CSS.
 *    - Example: if you have `.loading` in your styles, passing `"loading"`
 *   will remove it and re-enable interactions.
 * - **Validation:**
 *    - Throws `TypeError` if the `className` parameter is not a string.
 * @param {string} [className="on_processing"] - The CSS class to remove, defaults to `"on_processing"`.
 * @returns {void} Does not return anything.
 * @throws {TypeError} If `className` is not a string.
 * @example
 * enableUserInteraction();          // ➔ Removes "on_processing" class
 * enableUserInteraction("loading"); // ➔ Removes "loading" class
 * // ❌ Invalid value:
 * enableUserInteraction(123);       // ➔ Throws TypeError
 */
export const enableUserInteraction = (className: string = "on_processing"): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  assertIsString(className, {
    message({ validType, currentType }) {
      return `First parameter \`className\` must be of type \`${validType}\`, but received: \`${currentType}\`.`;
    }
  });

  const { documentElement } = document;

  if (documentElement && documentElement.classList.contains(className)) {
    documentElement.classList.remove(className);
  }
};

/** ----------------------------------------------------------
 * * ***Utility: `removeElementFocus`.***
 * ----------------------------------------------------------
 * **Removes focus from the currently active element in the document.**
 * - **Features**:
 *    - This function works **only in browser environments**.
 *    - If an element is focused, it will lose focus by calling `blur()`.
 *    - If no element is focused or the active element is not an `HTMLElement`, nothing happens.
 * @returns {void} Does not return anything.
 * @example
 * removeElementFocus(); // ➔ Removes focus from the currently active element
 */
export const removeElementFocus = (): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  } else {
    // not-support, currently we nothing to do...
    // console.warn("removeElementFocus: No active element to blur or unsupported element type.");
  }
};

/** ----------------------------------------------------------
 * * ***Utility: `scrollToTop`.***
 * ----------------------------------------------------------
 * **Scrolls the page to the top with optional smooth animation and delay.**
 * - **Features**:
 *    - This function works **only in browser environments** (no effect on server-side).
 *    - It leverages the native `window.scrollTo()` API with support for smooth scrolling
 * and an optional timeout delay before executing the scroll.
 * - Each option has strict valid values.
 *    - If an invalid value is provided, the function **automatically falls back to its default**.
 * @param {ScrollToTopOptions} [options] - Optional settings for scroll behavior.
 * @param {ScrollToTopOptions["behavior"]} [options.behavior="smooth"] - Scroll animation type.
 *   - Valid values: `"auto"`, `"instant"`, `"smooth"`.
 *   - Default force to `"smooth"` if missing or invalid.
 * @param {ScrollToTopOptions["timeout"]} [options.timeout=1] - Delay before scrolling (in milliseconds).
 *   - Default value is `1`.
 *   - Valid values: any number `≥` `1`.
 *   - Non-integer number are truncated to an integer.
 *   - Force to `2147483647` if number is larger than `2147483647`.
 *   - Default force to `1` if `missing`, `NaN`, `invalid`, or `less-than` `1`.
 * @returns {void} Does not return anything, only scrolling to top.
 * @example
 * // ✅ Valid options value:
 * scrollToTop();
 * // ➔ Scroll smoothly to the top after 1ms delay
 * scrollToTop({ behavior: "instant" });
 * // ➔ Jump instantly to the top
 * scrollToTop({ timeout: 500 });
 * // ➔ Scroll smoothly to the top after 500ms
 *
 * // ❌ Invalid options value:
 * scrollToTop({ behavior: "fly", timeout: -100 });
 * // ➔ Fallback: behavior="smooth", timeout=1
 * scrollToTop({ behavior: "fly", timeout: 123.55 });
 * // ➔ Fallback: behavior="smooth", timeout=123
 */
export const scrollToTop = (options?: ScrollToTopOptions): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  // Ensure options is an object and Defensive options check
  if (!isPlainObject(options)) {
    options = {};
  }

  const behavior: ScrollBehavior =
    hasOwnProp(options, "behavior") &&
    isNonEmptyString(options.behavior) &&
    ["auto", "instant", "smooth"].includes(options.behavior.trim())
      ? options.behavior
      : "smooth";
  let timeout =
    hasOwnProp(options, "timeout") && isNumber(options.timeout) && options.timeout >= 1
      ? options.timeout
      : 1;

  timeout = timeout > 2147483647 ? 2147483647 : timeout;

  setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior }), timeout);
};
