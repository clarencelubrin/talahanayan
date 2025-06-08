import { useOnClick } from 'src/features/tables/hooks/capture/use-onclick';
type ClickDropdownProps = {
    ref: React.RefObject<HTMLDivElement>;
    dropdownRef: React.RefObject<HTMLDivElement>;
    resizerRef?: React.RefObject<HTMLDivElement>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    position: React.MutableRefObject<DOMRect | undefined>;
}
// export function useClickDropdown({
//     ref,
//     dropdownRef,
//     resizerRef,
//     isOpen,
//     setIsOpen,
//     position
// }: ClickDropdownProps) {
//     useOnClick((event) => {
//         const target = event.target as Node;

//         const clickedInsideDropdown = dropdownRef.current?.contains(target);
//         const clickedInsideHeader = ref.current?.contains(target);
//         const clickedInsideResizer = resizerRef?.current?.contains(target);

//         if (clickedInsideDropdown) {
//             return; // Do nothing if click was inside the dropdown
//         }

//         if (!clickedInsideHeader && !clickedInsideResizer) {
//             // Clicked outside entirely – close
//             setIsOpen(false);
//             return;
//         }

//         if (clickedInsideHeader && !clickedInsideResizer) {
//             // Open only if header clicked directly (not resizer)
//             if (!isOpen) {
//                 // Read layout position **before** setting state
//                 position.current = ref.current?.getBoundingClientRect();
//                 requestAnimationFrame(() => setIsOpen(true));
//             } else {
//                 setIsOpen(false);
//             }
//         }
//     }, []); // Don't depend on `ref` or `isOpen`
// }
export function useClickDropdown({
    ref,
    dropdownRef,
    resizerRef,
    isOpen,
    setIsOpen,
    position
}:ClickDropdownProps){
    useOnClick((event) => {
        const target = event.target as Node;

        const clickedInsideDropdown = dropdownRef.current?.contains(target);
        const notClickedInsideHeader = ref.current && !ref.current.contains(event.target as Node);
        const notClickedInsideResizer = resizerRef && resizerRef.current && !resizerRef.current.contains(event.target as Node);

        if (clickedInsideDropdown) {
            // Ignore if it is a dropdown click
            return;
        }
        else if (notClickedInsideHeader) {
            setIsOpen(false);
        }
        else if (notClickedInsideResizer) {
            // Open dropdown
            position.current = ref.current?.getBoundingClientRect();
            requestAnimationFrame(() => setIsOpen(!isOpen));
        }
    }, [ref, isOpen]);
}