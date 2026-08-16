import { describe, expect, it, vi } from "vitest";
import { detectWebXRAR } from "./webxrSupport";

describe("detectWebXRAR", () => {
  it("requires HTTPS outside localhost", async () => {
    await expect(detectWebXRAR({ protocol: "http:", hostname: "astronexo.test" }, { isSessionSupported: vi.fn() })).resolves.toBe("insecure");
  });

  it("rejects browsers without navigator.xr", async () => {
    await expect(detectWebXRAR({ protocol: "https:", hostname: "astronexo.test" })).resolves.toBe("unsupported");
  });

  it("accepts an immersive-ar capable device", async () => {
    const isSessionSupported = vi.fn().mockResolvedValue(true);
    await expect(detectWebXRAR({ protocol: "https:", hostname: "astronexo.test" }, { isSessionSupported })).resolves.toBe("supported");
    expect(isSessionSupported).toHaveBeenCalledWith("immersive-ar");
  });

  it("fails closed when capability detection throws", async () => {
    await expect(detectWebXRAR({ protocol: "https:", hostname: "astronexo.test" }, { isSessionSupported: vi.fn().mockRejectedValue(new Error("blocked")) })).resolves.toBe("unsupported");
  });
});
