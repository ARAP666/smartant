import { ApiError, fetchSession } from "../api/client";
import { deleteSessionToken, getSessionToken } from "./session";

export const SESSION_QUERY_KEY = ["session"] as const;

export async function loadCurrentSession() {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const { user } = await fetchSession(token);
    return { token, user };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await deleteSessionToken();
      return null;
    }
    throw error;
  }
}
