"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import { ExitIcon } from "@radix-ui/react-icons";
import ThemeSwitcher from "../theme-switch";
export const UserButton = () => {
    const user = useCurrentUser();
  return (
    <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
            <Avatar className="shadow-sm shadow-muted-foreground">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-slate-900">
                    <FaUser className="w-6 h-6 text-slate-400"/>
                </AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col gap-y-4 justify-items-center w-10" align="end">
            <LogoutButton>
                <DropdownMenuItem className="justify-items-center flex gap-x-4 font-extrabold text-red-600 bg-red-600/15">
                    <ExitIcon className="w-4 h-4"/>
                    Logout
                </DropdownMenuItem>
            </LogoutButton>
            <ThemeSwitcher>
            <DropdownMenuItem>
            </DropdownMenuItem>
            </ThemeSwitcher>
        </DropdownMenuContent>
    </DropdownMenu>
  );
};