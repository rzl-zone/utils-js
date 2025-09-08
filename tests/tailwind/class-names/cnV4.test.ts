import { describe, it, expect } from "vitest";
import { cnV4 } from "@/tailwind/class-names/cn";

describe("cnV4 (default cnV4 with twMergeDefault)", () => {
  it("should merge basic Tailwind classes", () => {
    const result = cnV4("p-2 p-4");
    expect(result).toBe("p-4");
  });

  it("should merge clsx arrays", () => {
    const result = cnV4(["p-2", "p-4"], ["m-1", "m-3"]);
    expect(result).toBe("p-4 m-3");
  });

  it("should merge clsx objects", () => {
    const result = cnV4(
      { "text-red-500": true, "text-blue-500": false },
      "text-green-500"
    );
    expect(result).toBe("text-green-500");
  });

  it("should merge nested arrays and falsy values", () => {
    const result = cnV4(["p-2", ["p-4", undefined]], null, false, "p-6");
    expect(result).toBe("p-6");
  });

  it("should include default extended text-shadow classes", () => {
    const result = cnV4("text-shadow text-shadow-lg");
    expect(result).toBe("text-shadow-lg");
  });
});
