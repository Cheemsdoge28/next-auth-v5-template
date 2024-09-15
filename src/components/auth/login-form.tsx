"use client";
import * as z from "zod";
import { useTransition, useState } from "react";
import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { login } from "@/actions/login";
import Link from "next/link";
import { PasswordInput } from "../ui/password-input";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already used with a different provider"
      : "";
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.twoFactor) {
            setShowTwoFactor(true); // Stay on the 2FA screen
        } else {
            setShowTwoFactor(false); // Go back to the login screen if not required
        }
          setError(data?.error ?? "");
          setSuccess(data?.success ?? "");
        })
        .catch(() => {
          setError("Something went wrong.");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account yet?"
      backButtonHref="/auth/register"
      showSocial={true}
    >
      <Form {...form}>
        <form
          className="space-y-6 p-6 bg-background rounded-lg shadow-lg"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2FA Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                        type="text"
                        className="border-muted-foreground focus:border-slate-800 focus:ring-slate-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="hello@example.com"
                          type="email"
                          suffix={
                            <EnvelopeClosedIcon className="text-muted-foreground" />
                          }
                          className="border-muted-foreground focus:border-primary focus:ring-primary-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          disabled={isPending}
                          placeholder="********"
                          className="border-muted-foreground focus:border-primary focus:ring-primary-foreground"
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="text-accent-foreground"
                      >
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full py-3 bg-foreground text-accent hover:bg-primary rounded-lg"
          >
            {showTwoFactor ? "Verify" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
