"use client";
import * as z from "zod";
import { useTransition, useState } from "react";
import { NewPasswordSchema } from "@/schemas";
import { useForm } from "react-hook-form";  
import {zodResolver} from "@hookform/resolvers/zod";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import { newPassword } from "@/actions/new-password";

export const NewPasswordForm = () => {
    const SearchParams = useSearchParams();
    const token = SearchParams.get("token");
    const urlError = SearchParams.get("error") === "OAuthAccountNotLinked" ? "Email already used with a different provider" : ""
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            newPassword(values, token)
            .then((data) => {
                setError(data?.error ?? "");
                setSuccess(data?.success ?? "");
            })
        });
    }

    return (
        <CardWrapper 
            headerLabel="Enter a new password" 
            backButtonLabel="Back to login" 
            backButtonHref="/auth/login"
            showSocial={false} 
        >
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <FormField control={form.control} name="password" render={({field}) => 
                    (<FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <PasswordInput
                            {...field}
                            disabled={isPending}
                            placeholder="********"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}/>
                    <FormField control={form.control} name="confirmPassword" render={({field}) => 
                    (<FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                        <PasswordInput
                            {...field}
                            disabled={isPending}
                            placeholder="********"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}/>
                </div>
                <FormError message={error || urlError}/>
                <FormSuccess message={success}/>
                <Button disabled={isPending} type="submit" className="w-full">
                    Reset password
                </Button>
            </form>
        </Form>
        </CardWrapper>
    );
};
