import { describe, it, expect } from "vitest";
import { shouldForwardProp } from "@/index";

describe("shouldForwardProp", () => {
  it("should filter out specified props", () => {
    type Props = { $internal: boolean; custom: string; visible: boolean };

    // @ts-expect-error Ignore Required key only for test.
    const filter = shouldForwardProp<Props>(["$internal", "custom"]);

    expect(filter("$internal")).toBe(false);
    expect(filter("custom")).toBe(false);
    expect(filter("visible")).toBe(true);
    expect(filter("other")).toBe(true); // prop not in list should be forwarded
  });

  it("should handle empty array (forward everything)", () => {
    type Props = { foo: string };
    // @ts-expect-error Ignore Required key only for test.
    const filter = shouldForwardProp<Props>([]);

    expect(filter("foo")).toBe(true);
    expect(filter("bar")).toBe(true);
  });

  it("should throw error if props is not an array", () => {
    // @ts-expect-error purposely wrong
    expect(() => shouldForwardProp("not-an-array")).toThrowError(
      "Invalid argument: `props` must be an array from function `shouldForwardProp`."
    );
  });

  it("should support union type keys", () => {
    type Props = { a: string; b: number; c: boolean };
    // @ts-expect-error Ignore Required key only for test.
    const filter = shouldForwardProp<Props>(["a", "b"]);

    expect(filter("a")).toBe(false);
    expect(filter("b")).toBe(false);
    expect(filter("c")).toBe(true);
  });

  it("should work with number keys", () => {
    type Props = { 1: string; 2: string; three: string };
    // @ts-expect-error Ignore Required key only for test.
    const filter = shouldForwardProp<Props>([1]);

    expect(filter(1)).toBe(false);
    expect(filter(2)).toBe(true);
    expect(filter("three")).toBe(true);
  });

  it("should treat symbol keys safely", () => {
    type Props = { normal: string };
    const filter = shouldForwardProp<Props>(["normal"]);

    const sym = Symbol("something");
    expect(filter(sym)).toBe(true);
  });

  it("should coerce prop names to strings for comparison", () => {
    type Props = { foo: string; "data-test": string };
    // @ts-expect-error Ignore Required key only for test.
    const filter = shouldForwardProp<Props>(["data-test"]);

    expect(filter("data-test")).toBe(false);
    expect(filter("foo")).toBe(true);
  });

  it("should be robust with mixed casing and spacing", () => {
    type Props = { customProp: string; Another_Prop: number };
    const filter = shouldForwardProp<Props>(["customProp", "Another_Prop"]);

    expect(filter("customProp")).toBe(false);
    expect(filter("Another_Prop")).toBe(false);
    expect(filter("randomProp")).toBe(true);
  });
});
