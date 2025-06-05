import { useEffect, useRef } from 'react';

type Callback<T> = (current: T | null) => void;

export function useRefChange<T extends { scrollTop: number; scrollLeft: number }>(ref: React.MutableRefObject<T>, callback: Callback<T>) {
    const prevRef = useRef<T | null>(null);

    useEffect(() => {
        if (prevRef.current !== ref.current) {
            callback(ref.current);
        }
        prevRef.current = ref.current;
    }, [ref, callback]);
}