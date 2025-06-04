import { Dropdown } from "shared/ui/Dropdown/dropdown-ui";
import { NavButton } from "shared/ui/Buttons/nav-button";
import { LogOut } from "lucide-react";
import { useAuth } from "src/shared/api/api-auth";

export function SidebarUserDropdown({isOpen}: {isOpen: boolean}) {
    const { logOut } = useAuth();
    const handleOnClick = () => {
        logOut();
        localStorage.removeItem('username');
    }
    return (
        <Dropdown isOpen={isOpen} className="min-w-32">
            <div className="flex flex-col p-1 gap-1 bg-white border border-stone-200 rounded-md drop-shadow-lg group">
                <NavButton icon={LogOut} onClick={() => handleOnClick()}>
                    Log-out
                </NavButton>
            </div>
        </Dropdown>            
    )
}