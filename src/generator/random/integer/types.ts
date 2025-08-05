import type { RangeNumberTo999 } from "@/types";

export type RandomINTProps = {
  /** * Minimal `1` maximal `16` as number
   *
   *  @default 16 */
  length?: RangeNumberTo999<1, 16>;
  /** * Set `true` will avoiding (zero / 0) result of generating
   * @default false
   * */
  avoidZero?: true;
};
