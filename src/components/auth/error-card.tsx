import { CardWrapper } from "@/components/auth/card-wrapper";
import { FaFrown } from "react-icons/fa";

export const ErrorCard = () => {
    return (
        <CardWrapper headerLabel="Something went wrong!" backButtonHref="/auth/login" backButtonLabel="Back to login">
            <div className="w-full flex justify-center items-center text-3xl">
                :(
            </div>
        </CardWrapper>
    );
};