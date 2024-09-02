import { DefaultSession } from "next-auth";
import {JWT} from "@auth/core/jwt";
import { UserRoleDefinition } from "@/Userdefinitions/userdefinitions";

declare module "next-auth" {
    interface Session {
        user: {
            role: UserRole;
        } & DefaultSession["user"]
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        role?: UserRole;
    }
}

import { CredentialsSignin } from "next-auth";

export class UnverifiedEmailError extends CredentialsSignin {}