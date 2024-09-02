"use server";
import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { sendSecurityAlertMail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

interface NewPasswordResponse {
    error?: string;
    success?: string;
}

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null): Promise<NewPasswordResponse> => {
    if (!token) {
        return { error: "Invalid reset link" };
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { password, confirmPassword } = validatedFields.data;
    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: "Invalid reset link" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Reset link has expired" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        sendSecurityAlertMail(existingToken.email)
        return { error: "Something went wrong" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
    });

    await db.passwordResetToken.delete({
        where: { id: existingToken.id }
    })

    return {success: "Password reset successfully"};
}