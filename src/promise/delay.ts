import { isNumber, isNull } from "@/predicates";

/** ----------------------------------------
 * * ***Creates a delay for a specified duration.***
 * ----------------------------------------
 *
 * @param {number} [milliSeconds=1000] - The duration of the delay in milliSeconds (default: 1000ms).
 * @param {AbortSignal} [signal] - An optional AbortSignal to cancel the delay.
 * @returns {Promise<void>} A promise that resolves after the specified delay or rejects if aborted.
 *
 * @throws {TypeError} If `milliSeconds` is not a valid non-negative number.
 * @throws {TypeError} If `signal` is not a valid AbortSignal.
 * @throws {DOMException} If aborted, rejects with `AbortError`.
 *
 * @example
 * await delay(2000); // waits for 2 seconds
 *
 * // With AbortSignal
 * const controller = new AbortController();
 * delay(5000, controller.signal).catch(err => console.log(err.name)); // "AbortError"
 * controller.abort();
 */
export const delay = (
  milliSeconds: number = 1000,
  signal?: AbortSignal
): Promise<void> => {
  if (
    !isNumber(milliSeconds) ||
    !Number.isFinite(milliSeconds) ||
    milliSeconds <= 0
  ) {
    throw new TypeError(
      "`milliSeconds` must be a number, non-zero, non-NaN, non-negative, and non finite number."
    );
  }

  if (isNull(signal) || (signal && !(signal instanceof AbortSignal))) {
    throw new TypeError(
      "`signal` must be an instance of AbortSignal if provided."
    );
  }

  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, milliSeconds);

    const cleanup = () => {
      clearTimeout(timer);
      if (signal) signal.removeEventListener("abort", onAbort);
    };

    const onAbort = () => {
      cleanup();
      reject(new DOMException("Delay aborted", "AbortError"));
    };

    if (signal) {
      if (signal.aborted) {
        onAbort();
      } else {
        signal.addEventListener("abort", onAbort, { once: true });
      }
    }
  });
};
