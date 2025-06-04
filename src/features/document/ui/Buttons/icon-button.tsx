import { LucideProps } from 'lucide-react';
type IconButtonProps = {
    icon: React.ComponentType<LucideProps>;
    onClick?: () => void;
    className?: string;
    iconClassName?: string; 
    color?: string;
    disabled?: boolean;
};
export function IconButton({icon: Icon, onClick, className, iconClassName, color='hover:bg-stone-100 text-stone-500', disabled=false}: IconButtonProps) {
    return (
        <div className={`flex justify-center items-center rounded-md ${disabled ? 'text-stone-200' : color} ${className}`}
            onClick={() => !disabled && onClick?.()}        
        >
            <Icon size={24} strokeWidth={2} className={`shrink-0 ${iconClassName}`}/>
        </div>

    )
}
export function MicroIconButton({icon: Icon, onClick, className, iconClassName, color='hover:bg-stone-100 text-stone-500'}: IconButtonProps) {
    return (
        <div className={`flex justify-center items-center rounded-md ${color} ${className}`}
            onClick={onClick}        
        >
            <Icon size={18} strokeWidth={2} className={`shrink-0 ${iconClassName}`}/>
        </div>

    )
}