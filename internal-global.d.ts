/* eslint-disable @typescript-eslint/no-unused-vars */
import { isNaN as rzlIsNaN } from "./src/predicates/is/isNaN";
import { isFinite as rzlIsFinite } from "./src/predicates/is/isFinite";

// We used this for safe internally only.
declare global {
  /**
   * @deprecated ***Use {@link rzlIsFinite} instead***.
   * @param value The number to check
   * @returns true if the value is a finite number
   */
  function isFinite(value: unknown): boolean;

  /**
   * @deprecated ***Use {@link rzlIsNaN} instead***.
   * @param value The value to check
   * @returns true if the value is NaN
   */
  function isNaN(value: unknown): boolean;
}
