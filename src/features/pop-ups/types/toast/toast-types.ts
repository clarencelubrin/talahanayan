export type ToastProps = {
    children: React.ReactNode;
    type: ToastVariantType;
    is_visible: boolean;
    setIsVisible: (value: boolean) => void;
}
export type ToastType = {
    message: string;
    type: ToastVariantType;
    is_visible: boolean;
}

export type ToastUIProps = {
    children: React.ReactNode;
    type: ToastVariantType;
    is_visible: boolean;
    onClick: () => void;
}
export type ToastVariantType = 'success' | 'error' | 'none';