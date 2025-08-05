import type { AnyFunction } from "@/types";

type ResUnFTN<
  Force extends false | "stringOrNumber" | "primitives" | "all" = false
> = Force extends "all"
  ? Array<unknown[] | Record<string, unknown> | string>
  : Force extends "stringOrNumber"
  ? Array<
      | string
      | boolean
      | bigint
      | symbol
      | null
      | undefined
      | Record<string, unknown>
      | AnyFunction
      | unknown[]
      | Date
      | RegExp
      | Map<unknown, unknown>
      | Set<unknown>
      | Promise<unknown>
    >
  : Force extends "primitives"
  ? Array<
      | string
      | symbol
      | Record<string, unknown>
      | AnyFunction
      | unknown[]
      | Date
      | RegExp
      | Map<unknown, unknown>
      | Set<unknown>
      | Promise<unknown>
    >
  : Force extends false
  ? Array<
      | string
      | number
      | bigint
      | boolean
      | symbol
      | RegExp
      | Record<string, unknown>
      | AnyFunction
      | Date
      | Map<unknown, unknown>
      | Set<unknown>
      | Promise<unknown>
      | unknown[]
      | null
      | undefined
    >
  : unknown[];

type ResFTN<
  Force extends false | "stringOrNumber" | "primitives" | "all" = false
> = Force extends "all"
  ? Array<string | Record<string, unknown>>
  : Force extends "stringOrNumber"
  ? Array<
      | string
      | boolean
      | bigint
      | symbol
      | null
      | undefined
      | Record<string, unknown>
      | AnyFunction
      | Date
      | RegExp
      | Promise<unknown>
    >
  : Force extends "primitives"
  ? Array<
      | string
      | symbol
      | RegExp
      | Record<string, unknown>
      | AnyFunction
      | Date
      | Promise<unknown>
    >
  : Force extends false
  ? Array<
      | string
      | number
      | bigint
      | boolean
      | symbol
      | RegExp
      | Record<string, unknown>
      | AnyFunction
      | Date
      | Promise<unknown>
      | null
      | undefined
    >
  : unknown[];

export type DedupeResult<
  Force extends false | "stringOrNumber" | "primitives" | "all" = false,
  FTN extends boolean = false
> = FTN extends false ? ResUnFTN<Force> : ResFTN<Force>;
