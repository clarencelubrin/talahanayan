import { useOnClick } from 'src/features/tables/hooks/capture/use-onclick';
type ClickDropdownProps = {
    ref: React.RefObject<HTMLDivElement>;
    dropdownRef: React.RefObject<HTMLDivElement>;
    resizerRef?: React.RefObject<HTMLDivElement>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    position: React.MutableRefObject<DOMRect | undefined>;
}
export function useClickDropdown({
    ref,
    dropdownRef,
    resizerRef,
    isOpen,
    setIsOpen,
    position
}:ClickDropdownProps){
    useOnClick((event) => {
        if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
            // Ignore if it is a dropdown click
            return;
        }
        else if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        else if (resizerRef && resizerRef.current && !resizerRef.current.contains(event.target as Node)) {
            // Open dropdown
            position.current = ref.current?.getBoundingClientRect();
            setIsOpen(!isOpen);
        }
    }, [ref, isOpen]);
}