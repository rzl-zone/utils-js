/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Prettify } from "type-samurai";

// prettier-ignore
export type {
  Abs,And,AndArr,AnifyProperties,AnifyPropertiesOptions,AreAnagrams,ArrayElementType,Ceil,Color,ColorOptions,CompareNumberLength,CompareStringLength,Concat,Decrement,DefaultColorOptions,DefaultHSLOptions,DefaultRGBOptions,DigitsTuple,Div,Dot,EmptyArray,EmptyString,EndsWith,Even,Extends,ExtendsArr,Factorial,Fibonacci,FirstCharacter,FirstCharacterOptions,FirstDigit,Float,Floor,GetFloatNumberParts,HEX,HSL,HSLOptions,If,IfAny,IfColor,IfEmptyArray,IfEmptyString,IfEqual,IfEven,IfExtends,IfFloat,IfGreaterOrEqual,IfGreaterThan,IfHEX,IfHSL,IfInteger,IfLowerThan,IfNegative,IfNegativeFloat,IfNegativeInteger,IfNever,IfNonEmptyArray,IfNonEmptyString,IfNot,IfNotEqual,IfNotExtends,IfOdd,IfPositive,IfPositiveFloat,IfPositiveInteger,IfRGB,IfUnknown,Includes,Increment,IndexOf,Integer,IsAny,IsArray,IsArrayIndex,IsBetween,IsColor,IsDivisible,IsDivisibleByFive,IsDivisibleByHundred,IsDivisibleBySix,IsDivisibleByTen,IsDivisibleByThree,IsDivisibleByTwo,IsEmptyArray,IsEmptyString,IsEqual,IsEven,IsFloat,IsGreaterOrEqual,IsGreaterThan,IsHEX,IsHSL,IsInteger,IsLetter,IsLongerNumber,IsLongerString,IsLowerThan,IsMutableArray,IsNegative,IsNegativeFloat,IsNegativeInteger,IsNever,IsNonEmptyArray,IsNonEmptyString,IsNotEqual,IsOdd,IsPalindrome,IsPositive,IsPositiveFloat,IsPositiveInteger,IsRGB,IsReadonlyArray,IsSameLengthNumber,IsSameLengthString,IsShorterNumber,IsShorterString,IsStringLiteral,IsTuple,IsUnion,IsUnknown,Join,LastCharacter,LastCharacterOptions,Max,MaxArr,Min,MinArr,Mod,Mult,Mutable,MutableExcept,MutableOnly,Negate,Negative,NegativeFloat,NegativeInteger,NeverifyProperties,NeverifyPropertiesOptions,NonEmptyArray,NonEmptyString,NonNullableObject,NonNullableObjectExcept,NonNullableObjectOnly,Not,NotExtends,NumberLength,Odd,Or,OrArr,ParseNumber,PartialExcept,PartialOnly,PathToFields,PathToFieldsOptions,Pop,PopOptions,Positive,PositiveFloat,
  PositiveInteger,Pow,Prettify,PrettifyOptions,Push,RGB,RGBOptions,ReadonlyExcept,ReadonlyOnly,RemoveIndexSignature,RemoveLeading,Repeat,Replace,ReplaceAll,RequiredExcept,RequiredOnly,ReturnItselfIfExtends,ReturnItselfIfNotExtends,Reverse,Round,Shift,ShiftOptions,Slice,Sort,Split,StartsWith,StringLength,Stringify,Sub,Sum,SumArr,Swap,Switch,ToPrimitive,Trunc,TupleToObject,UnionToIntersection,UnknownifyProperties,UnknownifyPropertiesOptions,Unshift,ValueOf,ValueOfArray,ValueOfExcept,ValueOfOnly
} from "type-samurai";
/** --------------------------------------------------
 * * ***Extracts the argument types of a given function type `F`.***
 * --------------------------------------------------
 *
 * Useful when you need to infer or reuse the parameter types from an existing function signature.
 *
 * @template F A function type from which to extract argument types.
 *
 * @example
 * type Args = ArgumentTypes<(a: number, b: string) => void>; // [number, string]
 */
export type ArgumentTypes<F extends AnyFunction> = F extends (
  ...args: infer A
) => any
  ? A
  : never;

/** --------------------------------------------------
 * * ***Gets the element type from a readonly array or tuple.***
 * --------------------------------------------------
 *
 * Useful when working with `as const` arrays to extract the union of literal types.
 *
 * @template T A readonly array or tuple type.
 *
 * @example
 * const roles = ['admin', 'user'] as const;
 * type Role = GetArrayElementType<typeof roles>; // "admin" | "user"
 */
export type GetArrayElementType<T extends readonly any[]> =
  T extends readonly (infer U)[] ? U : never;

/** --------------------------------------------------
 * * ***Converts specific keys `K` in type `T` to required (non-optional), while keeping the rest unchanged.***
 * --------------------------------------------------
 *
 * This is useful when you need to enforce required fields conditionally.
 *
 * @template T The base object type.
 * @template K The keys within `T` to make required. Defaults to all keys in `T`.
 *
 * @example
 * type A = { a?: string; b?: number };
 * type B = RequiredKeys<A, 'a'>; // { a: string; b?: number }
 */
// @ts-expect-error no check
export type RequiredKeys<T, K extends keyof T = T> = Required<
  Pick<T, Extract<keyof T, K>>
> &
  OmitStrict<T, K> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

/** --------------------------------------------------
 * * ***Converts specific keys `K` in type `T` to optional (partial), while keeping the rest unchanged.***
 * --------------------------------------------------
 *
 * Useful when certain keys should be optional in certain contexts (e.g., form inputs).
 *
 * @template T The base object type.
 * @template K The keys within `T` to make optional. Defaults to all keys in `T`.
 *
 * @example
 * type A = { a: string; b: number };
 * type B = PartialKeys<A, 'a'>; // { a?: string; b: number }
 */
// @ts-expect-error no check
export type PartialKeys<T, K extends keyof T = T> = Partial<
  Pick<T, Extract<keyof T, K>>
> &
  OmitStrict<T, K> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

/** --------------------------------------------------
 * * ***Overrides properties in type `T` with properties from type `U`, based on matching keys.***
 * --------------------------------------------------
 *
 * Ensures the result retains all properties from `T`, but values from `U` override corresponding keys.
 *
 * @template T The base object type to override.
 * @template U The object type containing overriding properties.
 *
 * @example
 * type A = { a: number; b: string };
 * type B = { b: boolean };
 * type C = OverrideTypes<A, B>; // { a: number; b: boolean }
 */
export type OverrideTypes<
  T,
  U extends Partial<Record<keyof T, unknown>>
  // @ts-expect-error Ignore types
> = OmitStrict<T, keyof U> & U extends infer U
  ? { [K in keyof U]: U[K] }
  : never;

/** ---------------------------------
 * * ***Strictly omits keys `K` from type `T`, with optional flattening for readability using `Prettify`.***
 * ---------------------------------
 *
 * Greatly enhances autocomplete and type inspection clarity in editors by optionally flattening
 * nested intersections or mapped types into a cleaner shape.
 *
 * @template T The original object type.
 * @template K The keys to omit from `T`.
 * @template WithPrettify Whether to prettify the result (default is `true`).
 * @template WithPrettifyRecursive Whether to prettify nested object properties recursively (defaults to `true`).
 *
 * @example
 * type A = { a: number; b: string; c: boolean };
 * type B = OmitStrict<A, 'b'>;
 * // -> { a: number; c: boolean }
 *
 * type C = OmitStrict<A, 'b', false>;
 * // -> Omit without prettifying, keeps intersection structure
 *
 * type D = OmitStrict<A, 'b', true, false>;
 * // -> Prettifies only top level, does not recurse into nested objects
 *
 */
export type OmitStrict<
  T,
  K extends keyof T,
  WithPrettify extends boolean = true,
  WithPrettifyRecursive extends boolean = true
> = WithPrettify extends true
  ? Prettify<Omit<T, K>, { recursive: WithPrettifyRecursive }>
  : WithPrettify extends false
  ? Omit<T, K>
  : never;

/** ---------------------------------
 * * ***Pick Key Type Property with Enhanced Type Autocomplete.***
 * ---------------------------------
 *
 * Utility type that behaves exactly like the native `Pick<T, K>`, but can help with
 * type inference and IDE autocomplete in more constrained generic scenarios.
 *
 * @template T The base object type.
 * @template K The keys from `T` to be picked.
 *
 * @example
 * type A = { a: number; b: string; c: boolean };
 * type B = PickStrict<A, 'a' | 'c'>; // { a: number; c: boolean }
 */
export type PickStrict<T, K extends keyof T> = Pick<T, K>;

/** ---------------------------------
 * * ***Exclude Key Type Property with Enhanced Type Autocomplete.***
 * ---------------------------------
 *
 * Utility type that performs a stricter version of `Exclude<T, U>` by ensuring better type
 * narrowing and improved behavior in complex generic conditions.
 *
 * Especially useful in generic libraries or utility types where standard `Exclude` may
 * collapse or widen types unintentionally.
 *
 * @template T The full union or set of types.
 * @template U The type(s) to be excluded from `T`.
 *
 * @example
 * type A = 'a' | 'b' | 'c';
 * type B = ExcludeStrict<A, 'b'>; // 'a' | 'c'
 */
export type ExcludeStrict<T, U extends T> = T extends unknown
  ? 0 extends (U extends T ? ([T] extends [U] ? 0 : never) : never)
    ? never
    : T
  : never;

/** --------------------------------------------------
 * * ***Identity utility type that preserves the structure and inference of type `T`.***
 * --------------------------------------------------
 *
 * This is commonly used to force TypeScript to expand a mapped or intersection type
 * into a more readable and usable shape.
 *
 * @template T The type to preserve and normalize.
 *
 * @example
 * type A = { a: string; b: number };
 * type B = Identity<A>; // Same as A, but fully expanded in IDEs
 */
export type Identity<T> = { [P in keyof T]: T[P] };

/** --------------------------------------------------
 * * ***Replaces specified keys in a type with a new value type, making them optional.***
 * --------------------------------------------------
 *
 * This is useful when certain properties in a type should allow partial overrides
 * while keeping the rest of the structure intact.
 *
 * @template TypeToBeChecked The original object type.
 * @template KeyToBeReplaced The keys in the original type to be replaced.
 * @template NewValueToUse The new type to assign to the replaced keys.
 *
 * @example
 * type A = { name: string; age: number };
 * type B = ReplacingToPartial<A, 'age', string>; // { name: string; age?: string }
 */
export type ReplacingToPartial<
  TypeToBeChecked,
  KeyToBeReplaced extends keyof TypeToBeChecked,
  NewValueToUse
> = Identity<
  Pick<TypeToBeChecked, Exclude<keyof TypeToBeChecked, KeyToBeReplaced>> & {
    [P in KeyToBeReplaced]?: NewValueToUse;
  }
>;

/** --------------------------------------------------
 * * ***Replaces specified keys in a type with a new value type, making them required.***
 * --------------------------------------------------
 *
 * This is useful when redefining a property’s type while ensuring it's required in the resulting structure.
 *
 * @template TypeToBeChecked The original object type.
 * @template KeyToBeReplaced The keys in the original type to be replaced.
 * @template NewValueToUse The new type to assign to the replaced keys.
 *
 * @example
 * type A = { name?: string; age: number };
 * type B = ReplacingToRequired<A, 'name', string>; // { name: string; age: number }
 */
export type ReplacingToRequired<
  TypeToBeChecked,
  KeyToBeReplaced extends keyof TypeToBeChecked,
  NewValueToUse
> = Identity<
  Pick<TypeToBeChecked, Exclude<keyof TypeToBeChecked, KeyToBeReplaced>> & {
    [P in KeyToBeReplaced]: NewValueToUse;
  }
>;

/** --------------------------------------------------
 * * ***Represents an object with arbitrary string keys and values of any type.***
 * --------------------------------------------------
 *
 * This type is commonly used as a fallback or catch-all for flexible key-value structures
 * such as query parameters, configuration maps, or JSON-like data.
 *
 * ⚠️ Use with caution — `any` disables type safety. Prefer stricter typing when possible.
 *
 * @example
 * const config: ObjArrayKeyStringAny = {
 *   mode: "dark",
 *   retries: 3,
 *   debug: true,
 * };
 */
export type ObjArrayKeyStringAny = {
  [key: string]: any;
};

/** --------------------------------------------------
 * * ***Represents a broad union of commonly used JavaScript data types.***
 * --------------------------------------------------
 *
 * Includes primitive types, `object`, `null`, `undefined`, `symbol`, and a function signature.
 * This type is useful for scenarios where you need to support a wide range of inputs,
 * such as dynamic data processors, serializers, or value validators.
 *
 * @example
 * function isValidType(value: DataTypes): boolean {
 *   return value !== undefined && value !== null;
 * }
 */
// prettier-ignore
export type DataTypes =
  | bigint
  | boolean
  | ((string?: any) => void)
  | null
  | number
  | object
  | string
  | symbol
  | undefined;

/** --------------------------------------------------
 * * ***A custom extension of the native `Promise` type that allows explicit typing for both the resolved (`onSuccess`) and rejected (`onError`) values.***
 * --------------------------------------------------
 *
 * This type is useful when you want to strongly type both the success and error cases of an asynchronous operation,
 * particularly in scenarios like server actions, remote procedure calls (RPC), or custom async wrappers.
 *
 * @template onSuccess The type of the resolved value when the promise is fulfilled.
 * @template onError The type of the rejection reason when the promise is rejected. Defaults to `any`.
 *
 * @example
 * const fetchUser = (): CustomPromise<User, ApiError> => {
 *   return customRequest().catch(err => {
 *     handleError(err); // `err` is typed as `ApiError`
 *     return fallbackUser;
 *   });
 * };
 *
 * fetchUser().then(user => {
 *   // user is typed as `User`
 * });
 */
export type CustomPromise<onSuccess, onError = any> = {
  catch<TResult = never>(
    onrejected?:
      | ((reason: onError) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<onSuccess | TResult>;
} & Promise<onSuccess>;

/** ---------------------------------
 * * ***Helper: Prettify a Type or Interface for Easier Readability***
 * ---------------------------------
 *
 * This utility type recursively resolves and flattens the structure of a given type,
 * making the resulting type easier to read in IDE tooltips or inline type inspection.
 *
 * It is especially useful when dealing with deeply nested generics or intersection types
 * that are difficult to interpret directly.
 *
 * @template T The type or interface to prettify.
 *
 * @example
 * // Without Prettify:
 * type Result = A & B & { extra: string };
 *
 * // With Prettify:
 * type Result = PrettifyOld<A & B & { extra: string }>;
 *
 * @deprecated use type `Prettify` instead.
 */
export type PrettifyOld<T> = {
  [K in keyof T]: T[K] extends object ? PrettifyOld<T[K]> : T[K];
} & {};

/** --------------------------------------------------
 * * ***Represents common whitespace characters.***
 * --------------------------------------------------
 *
 * Used as the default trimming characters.
 */
export type Whitespace = " " | "\t" | "\r" | "\n";

/** --------------------------------------------------
 * * ***Recursively trims specified characters (default: whitespace) from the start (left) of a string.***
 * --------------------------------------------------
 *
 * @template Text The string to trim.
 * @template Chars The characters to remove from the beginning of the string. Defaults to `Whitespace`.
 *
 * @example
 * type T = TrimLeft<"\n  hello", " " | "\n">; // "hello"
 */
export type TrimLeft<
  Text extends string,
  Chars extends string | number = Whitespace
> = Text extends `${Chars}${infer Rest}` ? TrimLeft<Rest, Chars> : Text;

/** --------------------------------------------------
 * * ***Recursively trims specified characters (default: whitespace) from the end (right) of a string.***
 * --------------------------------------------------
 *
 * @template Text The string to trim.
 * @template Chars The characters to remove from the end of the string. Defaults to `Whitespace`.
 *
 * @example
 * type T = TrimRight<"hello  \t", " " | "\t">; // "hello"
 */
export type TrimRight<
  Text extends string,
  Chars extends string | number = Whitespace
> = Text extends `${infer Rest}${Chars}` ? TrimRight<Rest, Chars> : Text;

/** --------------------------------------------------
 * * ***Trims specified characters (default: whitespace) from both the start and end of a string.***
 * --------------------------------------------------
 *
 * @template Text The string to trim.
 * @template Chars The characters to remove. Defaults to `Whitespace`.
 *
 * @example
 * type T = Trim<"  hello  ", " ">; // "hello"
 */
export type Trim<
  Text extends string,
  Chars extends string | number = Whitespace
> = TrimRight<TrimLeft<Text, Chars>, Chars>;

/** --------------------------------------------------
 * * ***Replaces all occurrences of a pattern in a string with a replacement string.***
 * --------------------------------------------------
 *
 * @template Text The input string.
 * @template Pattern The substring to replace.
 * @template Replacement The replacement string. Defaults to an empty string.
 *
 * @example
 * type T = ReplaceAllOld<"foo-bar-bar", "bar", "baz">; // "foo-baz-baz"
 *
 * @deprecated use `ReplaceAll` instead.
 */
export type ReplaceAllOld<
  Text extends string,
  Pattern extends string | number,
  Replacement extends string = ""
> = Text extends `${infer Start extends string}${Pattern}${infer Rest extends string}`
  ? `${Start}${Replacement}${ReplaceAllOld<Rest, Pattern, Replacement>}`
  : Text;

/** --------------------------------------------------
 * * ***Converts a string to lowercase and trims leading and trailing whitespace.***
 * --------------------------------------------------
 *
 * @template S The input string.
 *
 * @example
 * type T = TrimsLower<"  HeLLo \n">; // "hello"
 */
export type TrimsLower<S extends string> = Trim<Lowercase<S>>;

/** --------------------------------------------------
 * * ***Recursively traverses an array (or nested object structure) and replaces all values of a given type (`Target`) with `NewType`.***
 * --------------------------------------------------
 *
 * Useful for remapping deeply nested arrays or records.
 *
 * @template Arr The input array or object.
 * @template Target The type to match and replace.
 * @template NewType The new type to assign in place of `Target`.
 *
 * @example
 * type A = [number, string, [number]];
 * type B = ChangeTypeOfValuesArray<A, number, boolean>; // [boolean, string, [boolean]]
 */
export type ChangeTypeOfValuesArray<Arr, Target, NewType> = Arr extends object
  ? {
      [K in keyof Arr]: ChangeTypeOfValuesArray<Arr[K], Target, NewType>;
    }
  : NewType;

/** --------------------------------------------------
 * * ***A generic type representing any function with any arguments and any return type.***
 * --------------------------------------------------
 *
 * @function {(...args: any[]) => any} AnyFunction
 *
 * @example
 * const fn: AnyFunction = (a, b) => a + b;
 * console.log(fn(1, 2)); // 3
 */
export type AnyFunction = (...args: any[]) => any;
