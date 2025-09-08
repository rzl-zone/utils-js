export type CustomizerIsEqualWith = (
  value: unknown,
  other: unknown,
  indexOrKey: PropertyKey,
  parent: unknown,
  otherParent: unknown,
  stack: unknown
) => boolean | undefined;
