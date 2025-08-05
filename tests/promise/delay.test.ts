import { describe, it, expect, vi } from "vitest";
import { delay } from "@/index";

describe("delay", () => {
  it("should resolve after the specified time (fake timers)", async () => {
    vi.useFakeTimers();
    const promise = delay(200);
    vi.advanceTimersByTime(200);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it("should default to 1000ms if no parameter is provided", async () => {
    vi.useFakeTimers();
    const promise = delay();
    vi.advanceTimersByTime(1000);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it("should throw if milliSeconds is not a number or invalid", () => {
    expect(() => delay(NaN)).toThrow(
      "`milliSeconds` must be a number, non-zero, non-NaN, non-negative, and non finite number."
    );
    expect(() => delay(0)).toThrow(
      "`milliSeconds` must be a number, non-zero, non-NaN, non-negative, and non finite number."
    );
    expect(() => delay(-1)).toThrow(
      "`milliSeconds` must be a number, non-zero, non-NaN, non-negative, and non finite number."
    );
    expect(() => delay(Number.POSITIVE_INFINITY)).toThrow(
      "`milliSeconds` must be a number, non-zero, non-NaN, non-negative, and non finite number."
    );
    // @ts-expect-error
    expect(() => delay("2000")).toThrow(
      "`milliSeconds` must be a number, non-zero, non-NaN, non-negative, and non finite number."
    );
    // @ts-expect-error
    expect(() => delay(null)).toThrow(
      "`milliSeconds` must be a number, non-zero, non-NaN, non-negative, and non finite number."
    );
  });

  it("should throw if signal is not an AbortSignal", () => {
    // @ts-expect-error
    expect(() => delay(100, {})).toThrow(
      "`signal` must be an instance of AbortSignal if provided."
    );
    // @ts-expect-error
    expect(() => delay(100, null)).toThrow(
      "`signal` must be an instance of AbortSignal if provided."
    );
  });

  it("should reject immediately if signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(delay(5000, controller.signal)).rejects.toHaveProperty(
      "name",
      "AbortError"
    );
  });

  it("should reject if signal is aborted before timeout completes", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const promise = delay(5000, controller.signal);

    vi.advanceTimersByTime(1000);
    controller.abort();
    await expect(promise).rejects.toHaveProperty("name", "AbortError");
    vi.useRealTimers();
  });

  it("should resolve if signal is not aborted", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const promise = delay(2000, controller.signal);

    vi.advanceTimersByTime(2000);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });
});
