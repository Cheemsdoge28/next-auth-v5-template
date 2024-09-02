"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetMail } from "@/lib/mail";
import { sendSecurityAlertMail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

interface ResetResponse {
    error?: string;
    success?: string;
}

export const reset = async (values: z.infer<typeof ResetSchema>): Promise<ResetResponse> => {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        sendSecurityAlertMail(email);
        return { success: "Email sent!" };
    }

    if (existingUser) {
        const passwordResetToken = await generatePasswordResetToken(email);
        await sendPasswordResetMail(email, passwordResetToken.token, existingUser.name || "");
        return { success: "Email sent!" };
    }

    return { error: "Something went wrong" };
}
