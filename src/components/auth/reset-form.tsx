"use client";
import * as z from "zod";
import { useTransition, useState } from "react";
import { ResetSchema } from "@/schemas";
import { useForm } from "react-hook-form";  
import {zodResolver} from "@hookform/resolvers/zod";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import { reset } from "@/actions/reset";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

export const ResetForm = () => {
    const SearchParams = useSearchParams();
    const urlError = SearchParams.get("error") === "OAuthAccountNotLinked" ? "Email already used with a different provider" : ""
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: ""
        }
    });

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            reset(values)
            .then((data) => {
                setError(data?.error ?? "");
                setSuccess(data?.success ?? "");
            })
        });
    }

    return (
        <CardWrapper 
            headerLabel="Forgot your password?" 
            backButtonLabel="Back to login" 
            backButtonHref="/auth/login"
            showSocial={false} 
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
                            suffix={<EnvelopeClosedIcon/>}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}/>
                </div>
                <FormError message={error || urlError}/>
                <FormSuccess message={success}/>
                <Button disabled={isPending} type="submit" className="w-full">
                    Send reset email
                </Button>
            </form>
        </Form>
        </CardWrapper>
    );
};
