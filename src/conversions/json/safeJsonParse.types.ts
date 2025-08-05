import type { IfExtends, IfNotExtends, IsAny } from "@/types";

type NonJsonParsableType = Omit<
  Exclude<unknown, string | null | undefined>,
  string
>;

// type UnknownSafeJsonParseValue = never;

type Contains<T, U> = [Extract<T, U>] extends [never] ? false : true;

// export type UnknownValue = NonJsonParsableType;
export type UnknownValue = { undefined: true };

export type SafeJsonParseResult<TData, T> = IfNotExtends<
  T,
  NonJsonParsableType
> extends true
  ? T extends never
    ? undefined
    : T extends void
    ? undefined
    : T extends number
    ? undefined
    : Contains<T, string> extends true
    ? Contains<T, null & string> extends true
      ? TData | null | undefined
      : TData | undefined
    : IfExtends<T, null> extends true
    ? null
    : IfNotExtends<T, NonJsonParsableType> extends true
    ? TData | null | undefined
    : undefined
  : Contains<T, string> extends true
  ? IsAny<T> extends true
    ? TData | undefined | null
    : TData | undefined
  : undefined;
