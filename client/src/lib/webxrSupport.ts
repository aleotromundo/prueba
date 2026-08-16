export type WebXRState = "checking" | "supported" | "unsupported" | "insecure";

type XRLike = { isSessionSupported?: (mode: string) => Promise<boolean> };

type LocationLike = { protocol: string; hostname: string };

export async function detectWebXRAR(location: LocationLike, xr?: XRLike): Promise<Exclude<WebXRState, "checking">> {
  if (location.protocol !== "https:" && location.hostname !== "localhost") return "insecure";
  if (!xr?.isSessionSupported) return "unsupported";
  try {
    return await xr.isSessionSupported("immersive-ar") ? "supported" : "unsupported";
  } catch {
    return "unsupported";
  }
}
