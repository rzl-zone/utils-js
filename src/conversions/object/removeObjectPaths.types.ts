import type { RangeNumberTo999 } from "@/types";

type Prev = [never, RangeNumberTo999<1, 40>];
type DotPath<
  T,
  Prefix extends string = "",
  Depth extends number = RangeNumberTo999<1, 40>
> = Depth extends never
  ? never
  : T extends (infer U)[]
  ? U extends object
    ? DotPath<U, `${Prefix}`, Prev[Depth]>
    : never
  : T extends object
  ? {
      [K in Extract<keyof T, string>]: T[K] extends object
        ? DotPath<T[K], `${Prefix}${K}.`, Prev[Depth]> | `${Prefix}${K}`
        : `${Prefix}${K}`;
    }[Extract<keyof T, string>]
  : never;
export type ConfigRemoveObjectPaths<T> = {
  key: DotPath<T>;
  deep?: boolean;
};
