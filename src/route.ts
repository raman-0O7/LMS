
export const ApiAuthPrefix = "/api/auth";

export const PublicRoutes = [
  "/auth/new-verification",
  '/api/uploadthing',
  '/api/webhook'
];

export const AuthRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  '/auth/reset',
  '/auth/new-password'
];

export const DEFAULT_REDIRECT_AFTER_LOGIN="/"