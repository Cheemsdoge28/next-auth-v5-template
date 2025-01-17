"use client";
import * as z from "zod";
import { useTransition, useState } from "react";
import { RegisterSchema } from "@/schemas";
import { useForm } from "react-hook-form";  
import {zodResolver} from "@hookform/resolvers/zod";
import { CardWrapper } from "@/components/auth/card-wrapper";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import { register } from "@/actions/register";
import { EnvelopeClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import { PasswordInput } from "../ui/password-input";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: ""
        } 
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            register(values)
            .then((data) => {
                setError(data.error);
                setSuccess(data.success);
            })
        });
    }

    return (
        <CardWrapper 
            headerLabel="Create an account" 
            backButtonLabel="Already have an account?" 
            backButtonHref="/auth/login"
            showSocial={true} 
        >
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <FormField control={form.control} name="name" render={({field}) => 
                    (<FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Et Cetera"
                            type="name"
                            suffix={<PersonIcon/>}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}/>
                    <FormField control={form.control} name="email" render={({field}) => 
                    (<FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                            {...field}
                            disabled={isPending}
                            placeholder="hello@example.com"
                            type="email"
                            suffix={<EnvelopeClosedIcon/>}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}/>
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
                <FormError message={error}/>
                <FormSuccess message={success}/>
                <Button disabled={isPending} type="submit" className="w-full">
                    Register
                </Button>
            </form>
        </Form>
        </CardWrapper>
    );
};
