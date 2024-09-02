import { Libre_Franklin } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Libre_Franklin({
    subsets: ["latin"],
    weight: ["700"],
});

interface HeaderProps {
    label: string;
};

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center">
            <h1 className={cn(font.className, "text-3xl font-bold")}>📖StudentRegistry</h1>
            <p className="text-muted-foreground text-sm">{label}</p>
        </div>
    )
}