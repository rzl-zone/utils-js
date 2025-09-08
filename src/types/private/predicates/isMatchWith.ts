export type CustomizerIsMatchWith = (
  value: unknown,
  other: unknown,
  indexOrKey: PropertyKey,
  object: object,
  source: object
) => boolean | undefined;
