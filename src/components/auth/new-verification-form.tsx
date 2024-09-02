"use client";

import { CardWrapper } from "./card-wrapper";
import { ClimbingBoxLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const SearchParams = useSearchParams();

    const token = SearchParams.get("token");

    const onSubmit = useCallback(() => {
        setError("");
        setSuccess("");
        if (!token) {
            setError("Invalid verification link");
            return;
        }
        newVerification(token)
        .then((data) => {
            setSuccess(data?.success ?? "");
            setError(data?.error ?? "");
        })
        .catch(() => {
            setError("Something went wrong");
        })
    }, [token]);

    useEffect (() => {onSubmit();}, [onSubmit]);
    return (
        <CardWrapper headerLabel="Confirming your verification" backButtonHref="/auth/login" backButtonLabel="Back to Login">
            <div className="flex items-center w-full justify-center space-y-4 flex-col">
                {!success && !error && (<ClimbingBoxLoader />)}
                <FormSuccess message={success} />
                <FormError message={error} />
            </div>
        </CardWrapper>
    )
}