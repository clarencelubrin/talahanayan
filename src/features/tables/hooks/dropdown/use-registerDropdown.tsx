import { useEffect } from "react";

type RegisterDropdownProps = {
    isOpen: boolean;
    dropdownRef: React.RefObject<HTMLDivElement>;
    setDropdownList: React.Dispatch<React.SetStateAction<HTMLElement[]>>;
}
export function useRegisterDropdown({isOpen, dropdownRef, setDropdownList}: RegisterDropdownProps) {
    useEffect(() => {
        // Register to the dropdown list if it is open
        if (isOpen) {
            setDropdownList((prev) => {
                return [...prev, dropdownRef.current as HTMLElement];
            });
        }
        // Else, remove from the list
        else {
            setDropdownList((prev) => {
                return prev.filter((value) => value !== dropdownRef.current);
            });
        }
    }, [isOpen]);
}