import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";
import { isAdmin } from "@/lib/auth";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const {nextUrl} = req;

    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isAdminRoute = nextUrl.pathname.startsWith('/admin');

    if (isAdminRoute && !(await isAdmin())) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    if (isApiAuthRoute) {
        return;
    }
    
    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return;
    }

    if (!isLoggedIn && !isPublicRoute && nextUrl.pathname !== '/auth/login') {
        return Response.redirect(new URL("/auth/login", nextUrl));
    }

    return;
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
