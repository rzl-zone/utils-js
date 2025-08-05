/* eslint-disable @typescript-eslint/no-explicit-any */
export type isMatchWithCustomizer = (
  value: any,
  other: any,
  indexOrKey: PropertyKey,
  object: object,
  source: object
) => boolean | undefined;
