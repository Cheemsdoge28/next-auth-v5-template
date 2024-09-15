"use client"
import { UserButton } from "@/components/auth/user-button"
import { NavButton } from "@/components/nav-button"
import { FaCog } from "react-icons/fa"
import { FaHome } from "react-icons/fa"
import { FaUserShield } from "react-icons/fa"
import { useCurrentUserRole } from "@/hooks/use-current-user"

export const Navbar = () => {
    const isAdmin = useCurrentUserRole() === "ADMIN";
    return (
        <nav className="absolute top-0 bg-secondary flex justify-between items-center p-4 m-1 rounded-xl w-11/12 shadow-md">
            <div className="flex gap-x-2">
                <NavButton href="/" label={<FaHome className="w-8 h-8"/>} />
                <NavButton href="/settings" label={<FaCog className="w-8 h-8"/>} />
                {isAdmin && <NavButton href="/admin" label={<FaUserShield className="w-8 h-8"/>} />}
            </div>
            <UserButton/>
        </nav>
    )
}