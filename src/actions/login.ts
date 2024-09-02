"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationMail } from "@/lib/mail";

// Define the response types more precisely
interface LoginResponse {
    error?: string;
    success?: string;
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
    
    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return {error: "Invalid credentials or incorrect provider"};
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
            return {success: "Check your email for a verification link"};
        }
        return {error: "Invalid credentials or incorrect provider"};
    }

    try {
        // Perform the login operation
        const result: SignInResult = await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        }) as SignInResult;

        // Check the result of the login attempt
        if (result.error) {
            return { error: result.error };
        }

        return { success: "Login successful" };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }

        // Re-throw non-AuthError exceptions
        throw error;
    }
};

