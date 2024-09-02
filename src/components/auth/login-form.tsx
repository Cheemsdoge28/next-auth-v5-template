"use client";
import * as z from "zod";
import { useTransition, useState } from "react";
import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";  
import {zodResolver} from "@hookform/resolvers/zod";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import {login} from "@/actions/login";
import Link from "next/link";

export const LoginForm = () => {
    const SearchParams = useSearchParams();
    const urlError = SearchParams.get("error") === "OAuthAccountNotLinked" ? "Email already used with a different provider" : ""
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values)
            .then((data) => {
                setError(data?.error ?? "");
                setSuccess(data?.success ?? "");
            })
        });
    }

    return (
        <CardWrapper 
            headerLabel="Welcome back" 
            backButtonLabel="Don't have an account yet?" 
            backButtonHref="/auth/register"
            showSocial={true} 
        >
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <FormField control={form.control} name="email" render={({field}) => 
                    (<FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                            {...field}
                            disabled={isPending}
                            placeholder="hello@example.com"
                            type="email"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}/>
                    <FormField control={form.control} name="password" render={({field}) => 
                    (<FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input
                            {...field}
                            disabled={isPending}
                            placeholder="********"
                            type="password"
                            />
                        </FormControl>
                        <Button size="lg" variant={"link"} asChild className="px-0 text-black font-normal">
                            <Link href ="/auth/reset">
                                Forgot password?
                            </Link>
                        </Button>
                        <FormMessage />
                    </FormItem>)}/>
                </div>
                <FormError message={error || urlError}/>
                <FormSuccess message={success}/>
                <Button disabled={isPending} type="submit" className="w-full">
                    Login
                </Button>
            </form>
        </Form>
        </CardWrapper>
    );
};
