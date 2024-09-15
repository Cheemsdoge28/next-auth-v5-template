"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { sendVerificationMail, sendTwoFactorAuthMail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";

// Constants for lockout policy
const MAX_ATTEMPTS = 5; // Max failed login attempts before lockout
const LOCKOUT_TIME = 5 * 60 * 1000; // Lockout time in milliseconds (5 minutes)

// Define the response types more precisely
interface LoginResponse {
    error?: string;
    success?: string;
    twoFactor?: boolean;
}

// Define the type of the result from signIn, including possible errors
interface SignInResult {
    error?: string;
}

export const login = async (values: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
    // Validate the fields using the schema
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, code } = validatedFields.data;
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Invalid credentials or incorrect provider" };
    }

    const now = new Date();
    
    // Check lockout status
    if (existingUser.failedAttempts >= MAX_ATTEMPTS && existingUser.lastFailedAttempt) {
        const timeSinceLastAttempt = now.getTime() - new Date(existingUser.lastFailedAttempt).getTime();
        if (timeSinceLastAttempt < LOCKOUT_TIME) {
            return {
                error: "Too many failed attempts. Try again later."
            };
        }
    }

    if (!existingUser.emailVerified) {
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (isPasswordCorrect) {
            const verificationToken = await generateVerificationToken(existingUser.email);
            await sendVerificationMail(
                existingUser.email,
                verificationToken.token,
                existingUser.name || undefined,
            );
            return { success: "Check your email for a verification link" };
        }
        return { error: "Invalid credentials or incorrect provider" };
    }

    // 2FA handling
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if (!twoFactorToken || twoFactorToken.token !== code) {
                await incrementFailedAttempts(existingUser.id);
                return { error: "Invalid 2FA code", twoFactor: true };
            }
            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                return { error: "2FA code expired", twoFactor: true };
            }
            await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

            // Proceed with login on successful 2FA
            await db.twoFactorConfirmation.create({
                data: { userId: existingUser.id },
            });
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorAuthMail(twoFactorToken.email, twoFactorToken.token);
            return { twoFactor: true };
        }
    }

    try {
        // Perform the login operation
        const result: SignInResult = await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        }) as SignInResult;

        if (result.error) {
            await incrementFailedAttempts(existingUser.id);
            return { error: result.error };
        }

        // Reset failed attempts on successful login
        await db.user.update({
            where: { id: existingUser.id },
            data: {
                failedAttempts: 0,
                lastFailedAttempt: null
            },
        });

        return { success: "Login successful" };
    } catch (error) {
        if (error instanceof AuthError) {
            await incrementFailedAttempts(existingUser.id);
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }
        throw error; // Re-throw non-AuthError exceptions
    }
};

// Helper function to increment failed attempts
async function incrementFailedAttempts(userId: string) {
    await db.user.update({
        where: { id: userId },
        data: {
            failedAttempts: {
                increment: 1,
            },
            lastFailedAttempt: new Date(),
        },
    });
}
