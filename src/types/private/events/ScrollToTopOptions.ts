export type ScrollToTopOptions = {
  /** Scroll animation type.
   *
   * - Valid values: `"auto"`, `"instant"`, `"smooth"`.
   * - Default force to `"smooth"` if missing or invalid.
   *
   * @default "smooth"
   */
  behavior?: ScrollBehavior | undefined;
  /** Delay before scrolling (in milliseconds).
   *
   * - Default value is `1`.
   * - Valid values: any number `≥` `1`.
   * - Non-integer number are truncated to an integer.
   * - Force to `2147483647` if number is larger than `2147483647`.
   * - Default force to `1` if `missing`, `NaN`, `invalid-type`, or `less-than` `1`.
   *
   * @default 1
   */
  timeout?: number | undefined;
};
