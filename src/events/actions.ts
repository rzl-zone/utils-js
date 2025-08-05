import { isServer } from "@/node-env";
import { isObject, isString } from "@/predicates";
import type { ScrollToTopOptions } from "@/types/private";

/** ----------------------------------------------------------
 * * ***Disables user interaction by adding a CSS class to the `<html>` element.***
 * ----------------------------------------------------------
 *
 * - Works only in **browser environments** (does nothing on the server-side).
 * - Prevents multiple additions of the same class.
 * - Can be used to indicate that a process is ongoing (e.g., loading state).
 *
 * @param {string} className - The CSS class to add (default: `"on_processing"`).
 * @returns {void}
 *
 * @example
 * disableUserInteraction(); // Adds "on_processing" class to <html>
 * disableUserInteraction("loading"); // Adds "loading" class to <html>
 */
export const disableUserInteraction = (
  className: string = "on_processing"
): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  if (!isString(className)) {
    throw new TypeError("Expected 'className' to be a 'string' type");
  }

  const { documentElement } = document;

  if (documentElement && !documentElement.classList.contains(className)) {
    documentElement.classList.add(className);
  }
};

/** ----------------------------------------------------------
 * * ***Enables user interaction by removing a CSS class from the `<html>` element.***
 * ----------------------------------------------------------
 *
 * - Works only in **browser environments** (does nothing on the server-side).
 * - Prevents errors if the class is already removed.
 * - Can be used to re-enable interactions after a process completes.
 *
 * @param {string} className - The CSS class to remove (default: `"on_processing"`).
 * @returns {void}
 *
 * @example
 * enableUserInteraction(); // Removes "on_processing" class from <html>
 * enableUserInteraction("loading"); // Removes "loading" class from <html>
 */
export const enableUserInteraction = (
  className: string = "on_processing"
): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  if (!isString(className)) {
    throw new TypeError("Expected 'className' to be a 'string' type");
  }

  const { documentElement } = document;

  if (documentElement && documentElement.classList.contains(className)) {
    documentElement.classList.remove(className);
  }
};

/** ----------------------------------------------------------
 * * ***Removes focus from the currently active element.***
 * ----------------------------------------------------------
 *
 * - Works only in **browser environments** (does nothing on the server-side).
 * - If an element is focused, it will lose focus.
 * - Logs a warning if no element is focused.
 *
 * @returns {void}
 *
 * @example
 * removeElementFocus(); // Removes focus from an active currently element.
 */
export const removeElementFocus = (): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  const activeElement = document.activeElement;

  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  } else {
    console.warn(
      "removeElementFocus: No active element to blur or is not supported on null element."
    );
  }
};

/** ----------------------------------------------------------
 * * ***Scrolls the page to the top with default smooth and extra optional settings.***
 * ----------------------------------------------------------
 *
 * - Works only in **browser environments** (does nothing on the server).
 * - Supports a **timeout delay** before scrolling.
 * - Uses the **native `window.scrollTo()`** API with smooth scrolling.
 *
 * @param {ScrollToTopOptions} [options] - Scrolling behavior options.
 * @param {ScrollBehavior} [options.behavior="smooth"] - The scroll behavior (`"auto"`,`"instant"` or `"smooth"`), default value is `"smooth"`.
 * @param {number} [options.timeout=1] - Delay (in milliseconds) before scrolling starts.
 * @returns {void}
 *
 * @example
 * smoothScrollToTop(); // Scrolls to top smoothly with 1ms delay
 * smoothScrollToTop({ behavior: "auto" }); // Instantly jumps to the top
 * smoothScrollToTop({ timeout: 500 }); // Scrolls to top after 500ms
 */
export const scrollToTop = (options?: ScrollToTopOptions): void => {
  // Ensure function runs only in the browser
  if (isServer()) return;

  // Ensure options is an object and Defensive options check
  if (!isObject(options)) {
    options = {};
  }

  const { behavior = "smooth", timeout = 1 } = options;

  setTimeout(
    () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: behavior,
      });
    },
    timeout < 1 ? 1 : timeout
  );
};
