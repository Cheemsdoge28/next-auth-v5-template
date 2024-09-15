/**
 * An array of public routes that do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    "/auth/new-verification"
]

/**
 * An array of routes that are used for authentication
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register", 
    "auth/error",
    "/auth/reset",
    "/auth/new-password",
]

/**
 * Prefix for the API routes.
 * They are used to determine if a route is an API auth route
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"

/**
 * The default route to redirect to after a successful login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings"
