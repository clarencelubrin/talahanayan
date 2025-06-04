import { useRef } from 'react';
export function useCaptureScroll(){
    const scrollPosition = useRef({ scrollTop: 0, scrollLeft: 0 });
    
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollLeft } = event.currentTarget;
        scrollPosition.current = { scrollTop, scrollLeft };
    };
    return { handleScroll, scrollPosition };
}