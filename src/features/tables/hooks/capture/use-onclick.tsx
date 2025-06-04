import { useEffect } from "react"

export function useOnClick(func = (_: MouseEvent) => {}, deps: React.DependencyList = []) {
    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            func(event);
        };

        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [deps]);
}