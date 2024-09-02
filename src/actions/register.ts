"use server";

import bcrypt, { genSalt } from "bcryptjs";
import { db } from "@/lib/db";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationMail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
        return {error: "Something went wrong"};
    }

    const {email, password, confirmPassword, name} = validatedFields.data;
    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return {error: "Something went wrong"};
    }
    await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name
        }
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationMail(
        verificationToken.email,
        verificationToken.token,
        name,
         
    );

    return {success: "Check your email for a verification link"};
};