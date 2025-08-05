import { assertIsString } from "@/index";
import { describe, it, expect } from "vitest";
import { performance } from "perf_hooks";

describe("assertIsString vs typeof === 'string' - benchmark", () => {
  it("compares performance", { timeout: 30000 }, () => {
    const loop = 1000;
    const validInput = "hello world";
    const invalidInput = "12345";

    console.log(`\n🚀 Running with ${loop.toLocaleString()} iterations...\n`);

    // typeof === "string"
    let t1 = performance.now();
    for (let i = 0; i < loop; i++) {
      if (typeof validInput !== "string") throw new Error("Expected string");
    }
    let t2 = performance.now();

    console.log(
      `🧪 typeof valid took ${(t2 - t1).toFixed(2)} ms ` +
        `(~${(((t2 - t1) * 1_000) / loop).toFixed(3)} μs/op)`
    );

    // assertIsString
    let t3 = performance.now();
    for (let i = 0; i < loop; i++) {
      assertIsString(validInput);
    }
    let t4 = performance.now();

    console.log(
      `✅ assertIsString valid took ${(t4 - t3).toFixed(2)} ms ` +
        `(~${(((t4 - t3) * 1_000) / loop).toFixed(3)} μs/op)`
    );

    // typeof fail
    let caughtTypeof = 0;
    let t5 = performance.now();
    for (let i = 0; i < loop; i++) {
      if (typeof invalidInput !== "string") caughtTypeof++;
    }
    let t6 = performance.now();

    console.log(
      `🛑 typeof invalid took ${(t6 - t5).toFixed(2)} ms ` +
        `(~${(((t6 - t5) * 1_000) / loop).toFixed(3)} μs/op)`
    );

    // assertIsString fail
    let caughtAssert = 0;
    let t7 = performance.now();
    for (let i = 0; i < loop; i++) {
      try {
        assertIsString(invalidInput);
      } catch {
        caughtAssert++;
      }
    }
    let t8 = performance.now();

    console.log(
      `❌ assertIsString invalid took ${(t8 - t7).toFixed(2)} ms ` +
        `(~${(((t8 - t7) * 1_000) / loop).toFixed(3)} μs/op)`
    );

    console.log(
      `⚠️  caught typeof: ${caughtTypeof}, caught assert: ${caughtAssert}\n`
    );
  });
});

describe("assertIsString", () => {
  it("should not throw for valid string", () => {
    expect(() => assertIsString("hello")).not.toThrow();
    expect(() => assertIsString("")).not.toThrow();
  });

  it("should throw with default message for non-string", () => {
    expect(() => assertIsString(42)).toThrow(
      "Expected value to be 'string', but got 'number'"
    );
    expect(() => assertIsString(null)).toThrow(
      "Expected value to be 'string', but got 'object'"
    );
  });

  it("should use custom string message if provided", () => {
    expect(() => assertIsString(42, "Must be a string!")).toThrow(
      "Must be a string!"
    );
    expect(() => assertIsString(42, "    Must be a string!   ")).toThrow(
      "Must be a string!"
    );
  });

  it("should use custom function message if provided", () => {
    expect(() =>
      assertIsString(42, (type) => `Expected string but got ${type}`)
    ).toThrow("Expected string but got number");

    expect(() =>
      assertIsString({}, (type) => `Expected string but got ${type}`)
    ).toThrow("Expected string but got object");
  });

  it("should fallback to default message if empty string given", () => {
    expect(() => assertIsString(42, "   ")).toThrow(
      "Expected value to be 'string', but got 'number'"
    );
  });
});
