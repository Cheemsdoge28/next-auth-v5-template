"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
interface NavButtonProps {
    href: string;
    label: string | React.ReactNode;
};

export const NavButton = ({ href, label }: NavButtonProps) => {
    const pathname = usePathname();
    return (
        <Button variant={pathname === href ? "default" : "outline" } className={pathname === href ? "font-normal w-full shadow-2xl text-accent" : "font-normal w-full shadow-lg text-foreground" } size={"lg"} asChild>
            <Link href={href}>
            {label}
            </Link>
        </Button>
    )
};