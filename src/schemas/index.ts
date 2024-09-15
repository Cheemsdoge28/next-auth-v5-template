import * as z from "zod";

// Schema for new password input, ensuring password complexity and confirmation
export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required." })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Schema for resetting a password with email validation
export const ResetSchema = z.object({
  email: z.string().email({ message: "Valid email is required." }),
});

// Schema for login with email and password validation
export const LoginSchema = z.object({
  email: z.string().email({ message: "Valid email is required." }),
  password: z.string().min(1, { message: "Password is required." }),
  code: z.optional(z.string()),
});

// Schema for registering a new user with validation for email, password, and name
export const RegisterSchema = z.object({
  email: z.string().email({ message: "Valid email is required." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
    confirmPassword: z
    .string()
    .min(1, { message: "Confirm password is required." }),
  name: z.string().min(1, { message: "Name is required." }),
});
