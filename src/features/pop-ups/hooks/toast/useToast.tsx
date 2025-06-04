import { produce } from 'immer';
import { useEffect, useState } from 'react';
import { ToastType, ToastVariantType } from '../../types/toast/toast-types';
export function useToast() {
    const [toast, setToast] = useState<ToastType>({ message: '', type: 'none', is_visible: false });

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast();
        }, 5000);
        return () => clearTimeout(timer);
    }, [toast]);

    const addToast = (message: string | undefined, type: ToastVariantType) => {
        removeToast();
        setToast({ message: message || '', type, is_visible: true });
    }

    const removeToast = () => {
        setToast(prev => produce(prev, draft => {
            if (draft) {
                draft.is_visible = false;
            }
        }));
    }

    const setIsVisible = (value: boolean) => {
        setToast(prev => produce(prev, draft => {
            if (draft) {
                draft.is_visible = value;
            }
        }));
    }
    return { toast, addToast, removeToast, setIsVisible };
}