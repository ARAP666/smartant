import type { LoginInput } from "@/features/auth/login-schema";
import type { RegisterInput } from "@/features/auth/register-schema";
import type { Income, IncomeInput } from "@/features/incomes/income-schema";
import type { ProfileInput } from "@/features/profile/profile-schema";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

type RegisterResponse = {
  data: {
    user: { id: string; email: string };
    sessionToken: string;
  };
};

export async function registerAccount(input: RegisterInput) {
  return authenticate("/api/v1/auth/register", input);
}

export function loginAccount(input: LoginInput) {
  return authenticate("/api/v1/auth/login", input);
}

export async function fetchSession(token: string) {
  return request<{ user: { id: string; email: string } }>(
    "/api/v1/auth/session",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

export async function logoutAccount(token: string) {
  await request<void>("/api/v1/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchProfile(token: string) {
  return request<{ profile: ProfileInput & { email: string } }>(
    "/api/v1/profile",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
}

export async function saveProfile(token: string, input: ProfileInput) {
  return request<{ profile: ProfileInput & { email: string } }>(
    "/api/v1/profile",
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
  );
}

export async function fetchIncomes(token: string) {
  return request<{ incomes: Income[] }>("/api/v1/incomes", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createIncome(token: string, input: IncomeInput) {
  return request<{ income: Income }>("/api/v1/incomes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function updateIncome(
  token: string,
  id: string,
  input: IncomeInput,
) {
  return request<{ income: Income }>(`/api/v1/incomes/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function deleteIncome(token: string, id: string) {
  await request<void>(`/api/v1/incomes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function authenticate(path: string, input: RegisterInput | LoginInput) {
  return request<RegisterResponse["data"]>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, init);
  if (response.status === 204) return undefined as T;
  const body = (await response.json()) as { data: T } | ApiErrorResponse;

  if (!response.ok || !("data" in body)) {
    throw new ApiError(
      response.status,
      "error" in body ? body.error.message : "No se pudo crear la cuenta",
    );
  }

  return body.data;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details: Record<string, unknown>;
    requestId: string;
  };
};
