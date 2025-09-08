/** --------------------------------------------------
 * * ***Awaitable.***
 * --------------------------------------------------
 * Represents a type that can be awaited:
 * either a plain value `T` or a `PromiseLike<T>`.
 *
 * @template T - The inner value type.
 *
 * @example
 * ```ts
 * async function wrap<T>(v: Awaitable<T>): Promise<T> {
 *   return await v;
 * }
 *
 * const a = wrap(42);           // Promise<number>
 * const b = wrap(Promise.resolve("hi")); // Promise<string>
 * ```
 */
export type Awaitable<T> = T | PromiseLike<T>;

/** --------------------------------------------------
 * * ***CustomPromise.***
 * --------------------------------------------------
 * A custom extension of the native `Promise` type that allows explicit typing
 * for both the resolved (`onSuccess`) and rejected (`onError`) values.
 *
 * ✅ Useful for strongly typing both success and error cases in async operations.
 *    Example: server actions, RPC, or custom async wrappers.
 *
 * @template onSuccess - The type of the resolved value when fulfilled.
 * @template onError - The type of the rejection reason when rejected. Defaults to `any`.
 *
 * @example
 * ```ts
 * const fetchUser = (): CustomPromise<User, ApiError> => {
 *   return customRequest().catch(err => {
 *     handleError(err); // `err` is typed as ApiError
 *     return fallbackUser;
 *   });
 * };
 *
 * fetchUser().then(user => {
 *   // ➔ user is typed as User
 * });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomPromise<onSuccess, onError = any> = {
  catch<TResult = never>(
    onrejected?: ((reason: onError) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<onSuccess | TResult>;
} & Promise<onSuccess>;
