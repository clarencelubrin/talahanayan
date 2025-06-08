import { LucideProps } from 'lucide-react';

type NavButtonProps = {
    icon?: React.ComponentType<LucideProps>;
    children?: React.ReactNode;
    className?: string;
    id?: string;

    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;

    isRounded?: boolean;
    hasHover?: boolean;
};
type NavToggleProps = {
    icon?: React.ComponentType<LucideProps>;
    children?: React.ReactNode;
    className?: string;
    isToggled: boolean;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;

    isRounded?: boolean;
};
export function NavButton({icon: Icon, children, className, id, onClick, onMouseEnter, onMouseLeave, isRounded=true, hasHover=true}: NavButtonProps) {
    return (
        <button className={`flex items-center gap-2 font-semibold text-left px-2 py-1 text-sm text-stone-500 
            ${hasHover? 'hover:bg-pink-50 hover:text-pink-500 active:bg-pink-100 active:text-pink-600 active:translate-y-0.5 transition duration-150 ease-in-out' : ''} 
            ${isRounded? 'rounded-md': ''} whitespace-none truncate ${className}`}
            onClick={onClick}
            id={id}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {Icon && <Icon size={18} strokeWidth={2} className='shrink-0'/>}
            {children}
        </button>
    )
}
export function NavToggle({icon: Icon, children, className, isToggled, onClick, onMouseEnter, onMouseLeave, isRounded=true}: NavToggleProps) {
    return (
        <button className={`flex items-center gap-2 font-semibold text-left ps-2 pe-3 py-1 text-sm hover:bg-pink-50 hover:text-pink-500
            ${isToggled? 'bg-pink-50 text-pink-500 transition duration-150 ease-in-out' : 'text-stone-500'} 
            ${isRounded? 'rounded-md': ''} truncate ${className}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {Icon && <Icon size={18} strokeWidth={2} className='shrink-0'/>}
            {children}
        </button>
    )
}