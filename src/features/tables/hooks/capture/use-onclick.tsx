import { useEffect, useRef } from "react";

export function useOnClick(callback: (event: MouseEvent) => void, deps: any[] = []) {
    const callbackRef = useRef(callback);

    // Keep ref updated with the latest function
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            callbackRef.current(event);
        };

        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [...deps]);
}
