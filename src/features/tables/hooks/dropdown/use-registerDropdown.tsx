import { useEffect } from "react";

type RegisterDropdownProps = {
    isOpen: boolean;
    dropdownRef: React.RefObject<HTMLDivElement>;
    setDropdownList: React.Dispatch<React.SetStateAction<HTMLElement[]>>;
}
export function useRegisterDropdown({isOpen, dropdownRef, setDropdownList}: RegisterDropdownProps) {
    useEffect(() => {
        const currentDropdown = dropdownRef.current as HTMLElement | null;
        if (!currentDropdown) return;

        if (isOpen) {
            setDropdownList((prev) => {
                // Avoid duplicates
                if (prev.includes(currentDropdown)) return prev;
                return [...prev, currentDropdown];
            });
        } else {
            setDropdownList((prev) => prev.filter((value) => value !== currentDropdown));
        }
        // Cleanup: always remove on unmount
        return () => {
            setDropdownList((prev) => prev.filter((value) => value !== currentDropdown));
        };
    }, [isOpen, dropdownRef, setDropdownList]);
}