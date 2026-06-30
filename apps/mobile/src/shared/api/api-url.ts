const localApiUrl = "http://localhost:3000";

export function resolveApiUrl(value: string | undefined, development: boolean) {
  const candidate = value?.trim() || (development ? localApiUrl : undefined);
  if (!candidate) throw new Error("EXPO_PUBLIC_API_URL is required");

  const url = new URL(candidate);
  if (!development && url.protocol !== "https:") {
    throw new Error("EXPO_PUBLIC_API_URL must use HTTPS outside development");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("EXPO_PUBLIC_API_URL must be an HTTP(S) URL");
  }
  return url.toString().replace(/\/$/, "");
}

const development =
  typeof __DEV__ === "boolean"
    ? __DEV__
    : process.env.NODE_ENV !== "production";

export const API_URL = resolveApiUrl(
  process.env.EXPO_PUBLIC_API_URL,
  development,
);
