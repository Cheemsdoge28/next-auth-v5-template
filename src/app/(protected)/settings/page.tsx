"use client";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/logout";
const SettingsPage = () => {
    const user = useCurrentUser();
    
    const onClick = () => {
        logout();
    };

    return (
        <></>
        // <div className="bg-background p-10 rounded-xl">
        //     <div>
        //         <Button onClick={onClick} type="submit">Sign Out</Button>
        //     </div>
        // </div>
    );
};

export default SettingsPage;