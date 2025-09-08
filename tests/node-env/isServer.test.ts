// @vitest-environment node

import { isServer } from "@/env/isServer";
import { describe, it, expect } from "vitest";

describe("isServer", () => {
  it("should return true if window is undefined (server-side)", () => {
    expect(isServer()).toBe(true);
  });

  it("should return false if window and document are defined (client-side)", () => {
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;

    globalThis.window = {} as any;
    globalThis.document = {} as any;

    expect(isServer()).toBe(false);

    // Cleanup
    if (originalWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      globalThis.window = originalWindow;
    }

    if (originalDocument === undefined) {
      delete (globalThis as any).document;
    } else {
      globalThis.document = originalDocument;
    }
  });
});
