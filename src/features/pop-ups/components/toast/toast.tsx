import { ToastUI } from "../../ui/toast/toast-ui";
import { TriangleAlert, CircleCheckBig } from 'lucide-react';
import { ToastProps } from "../../types/toast/toast-types";

export function Toast({
    children,
    type,
    is_visible,
    setIsVisible
}: ToastProps) {
    const handleOnClick = () => {
        setIsVisible(false);
    }
    return (
        <ToastUI is_visible={is_visible} type={type} onClick={() => handleOnClick()}>
            <div className="flex flex-row gap-3 items-center">
                <span className={`${(type === 'success') ? 'text-green-500' : 'text-red-500'}`} >
                    {(type === 'success') ? <CircleCheckBig size={32} strokeWidth={2} /> : <TriangleAlert size={32} strokeWidth={2} />}
                </span>
                <div className="flex flex-col justify-center">
                    <span className="text-stone-700 font-bold text-md">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    <span className="text-stone-500 font-semibold text-sm truncate">{children}</span>         
                </div>                
            </div>
        </ToastUI>
    )
}