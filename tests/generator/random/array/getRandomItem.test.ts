import { describe, it, expect, vi } from "vitest";
import { getRandomItem } from "@/index";

/**
 * Tests for getRandomItem function
 *
 * Ensures that getRandomItem:
 * - Returns a random element from a non-empty array.
 * - Returns `undefined` if the array is empty.
 * - Returns `undefined` if the input is not an array.
 * - Works predictably with mocked Math.random.
 */
describe("getRandomItem", () => {
  it("should return a random element from the array", () => {
    const array = [100, 200, 300, 400, 500];

    // Mock Math.random to produce predictable outputs
    vi.spyOn(Math, "random").mockReturnValue(0.1); // 0.1 * 5 = 0.5 -> floor = 0
    expect(getRandomItem(array)).toBe(100);

    vi.spyOn(Math, "random").mockReturnValue(0.6); // 0.6 * 5 = 3 -> floor = 3
    expect(getRandomItem(array)).toBe(400);

    vi.restoreAllMocks();
  });

  it("should return undefined for an empty array", () => {
    expect(getRandomItem([])).toBeUndefined();
  });

  it("should return undefined if input is not an array", () => {
    // @ts-expect-error intentionally invalid to test robustness
    expect(getRandomItem(null)).toBeUndefined();

    // @ts-expect-error intentionally invalid to test robustness
    expect(getRandomItem("not-an-array")).toBeUndefined();
  });

  it("should handle arrays with a single element", () => {
    expect(getRandomItem([42])).toBe(42);
  });
});
