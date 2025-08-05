export interface ArrayLike<T> {
  readonly length: number;
  readonly [n: number]: T;
}
