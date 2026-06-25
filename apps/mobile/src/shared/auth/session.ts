import * as SecureStore from "expo-secure-store";
import { SESSION_TOKEN_KEY } from "./session-key";

export { SESSION_TOKEN_KEY } from "./session-key";

export function saveSessionToken(token: string) {
  return SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
}

export function getSessionToken() {
  return SecureStore.getItemAsync(SESSION_TOKEN_KEY);
}

export function deleteSessionToken() {
  return SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
}
