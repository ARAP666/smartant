import { randomUUID } from "node:crypto";
import express from "express";
import { type LoginInput, loginSchema } from "./features/auth/login.js";
import {
  type RegisterInput,
  registerSchema,
} from "./features/auth/register.js";
import { getBearerToken } from "./features/auth/session.js";
import {
  type ProfileInput,
  profileSchema,
} from "./features/profile/profile.js";
import { AppError } from "./shared/errors.js";

type RegistrationResult = {
  user: { id: string; email: string };
  sessionToken: string;
};

export type AuthHandlers = {
  register: (input: RegisterInput) => Promise<RegistrationResult>;
  login: (input: LoginInput) => Promise<RegistrationResult>;
  authenticate: (
    token: string,
  ) => Promise<{ id: string; email: string } | null>;
  logout: (token: string) => Promise<void>;
};

export type ProfileHandlers = {
  getProfile: (userId: string) => Promise<{
    profile: { email: string; currency: string; timeZone: string };
  }>;
  updateProfile: (
    userId: string,
    input: ProfileInput,
  ) => Promise<{
    profile: { email: string; currency: string; timeZone: string };
  }>;
};

const unavailable: AuthHandlers = {
  register: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Registration unavailable");
  },
  login: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Login unavailable");
  },
  authenticate: async () => null,
  logout: async () => {
    throw unauthorized();
  },
};

const unavailableProfile: ProfileHandlers = {
  getProfile: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Profile unavailable");
  },
  updateProfile: async () => {
    throw new AppError(500, "NOT_CONFIGURED", "Profile unavailable");
  },
};

export function createApp(
  checkDatabase: () => Promise<void>,
  auth: Partial<AuthHandlers> | AuthHandlers["register"] = {},
  profile: Partial<ProfileHandlers> = {},
) {
  const handlers =
    typeof auth === "function"
      ? { ...unavailable, register: auth }
      : { ...unavailable, ...auth };
  const profileHandlers = { ...unavailableProfile, ...profile };
  const app = express();
  app.use(express.json());

  app.get("/api/v1/health", async (_request, response) => {
    try {
      await checkDatabase();
      response.json({ data: { status: "ok", database: "ok" } });
    } catch {
      response.status(503).json({
        error: {
          code: "DATABASE_UNAVAILABLE",
          message: "Database unavailable",
          details: {},
          requestId: randomUUID(),
        },
      });
    }
  });

  app.post("/api/v1/auth/register", async (request, response) => {
    const requestId = randomUUID();
    const parsed = registerSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(422).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid registration data",
          details: { fieldErrors: parsed.error.flatten().fieldErrors },
          requestId,
        },
      });
      return;
    }

    try {
      response.status(201).json({ data: await handlers.register(parsed.data) });
    } catch (error) {
      const safeError =
        error instanceof AppError
          ? error
          : new AppError(500, "INTERNAL_ERROR", "Unexpected server error");
      response.status(safeError.status).json({
        error: {
          code: safeError.code,
          message: safeError.message,
          details: safeError.details,
          requestId,
        },
      });
    }
  });

  app.post("/api/v1/auth/login", async (request, response) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(
        response,
        new AppError(422, "VALIDATION_ERROR", "Invalid login data", {
          fieldErrors: parsed.error.flatten().fieldErrors,
        }),
      );
      return;
    }

    try {
      response.json({ data: await handlers.login(parsed.data) });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/v1/auth/session", async (request, response) => {
    try {
      const token = getBearerToken(request.header("Authorization"));
      const user = token ? await handlers.authenticate(token) : null;
      if (!user) {
        sendError(response, unauthorized());
        return;
      }
      response.json({ data: { user } });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.post("/api/v1/auth/logout", async (request, response) => {
    try {
      const token = getBearerToken(request.header("Authorization"));
      const user = token ? await handlers.authenticate(token) : null;
      if (!token || !user) {
        sendError(response, unauthorized());
        return;
      }
      await handlers.logout(token);
      response.status(204).send();
    } catch (error) {
      sendError(response, error);
    }
  });

  app.get("/api/v1/profile", async (request, response) => {
    try {
      const user = await authenticateRequest(request, handlers);
      response.json({ data: await profileHandlers.getProfile(user.id) });
    } catch (error) {
      sendError(response, error);
    }
  });

  app.patch("/api/v1/profile", async (request, response) => {
    const parsed = profileSchema.safeParse(request.body);
    if (!parsed.success) {
      sendError(
        response,
        new AppError(422, "VALIDATION_ERROR", "Invalid profile data", {
          fieldErrors: parsed.error.flatten().fieldErrors,
        }),
      );
      return;
    }

    try {
      const user = await authenticateRequest(request, handlers);
      response.json({
        data: await profileHandlers.updateProfile(user.id, parsed.data),
      });
    } catch (error) {
      sendError(response, error);
    }
  });

  return app;
}

function unauthorized() {
  return new AppError(401, "UNAUTHORIZED", "Authentication required");
}

function sendError(response: express.Response, error: unknown) {
  const safeError =
    error instanceof AppError
      ? error
      : new AppError(500, "INTERNAL_ERROR", "Unexpected server error");
  response.status(safeError.status).json({
    error: {
      code: safeError.code,
      message: safeError.message,
      details: safeError.details,
      requestId: randomUUID(),
    },
  });
}

async function authenticateRequest(
  request: express.Request,
  handlers: AuthHandlers,
) {
  const token = getBearerToken(request.header("Authorization"));
  const user = token ? await handlers.authenticate(token) : null;
  if (!user) throw unauthorized();
  return user;
}
