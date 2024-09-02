"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";

interface VerificationResponse {
    error?: string;
    success?: string;
}
export const newVerification = async (token: string): Promise<VerificationResponse> => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return {error: "Something went wrong"};
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return {error: "The verification link has expired"};
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return {error: "Something went wrong"};
    }

    await db.user.update({
        where: { id: existingUser.id },
        data: { 
            emailVerified: new Date(),
            email: existingToken.email
         },

    });

    await db.verificationToken.delete({
        where: { id: existingToken.id }
    });

    return {success: "Email verified"};
}