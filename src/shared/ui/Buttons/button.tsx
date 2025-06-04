type ButtonProps = {
    children?: React.ReactNode;
    className?: string;

    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;

    isRounded?: boolean;
    hasHover?: boolean;
    type?: "button" | "submit" | "reset";
};

export function Button({ children, className, onClick, onMouseEnter, onMouseLeave, isRounded=true, hasHover=true, type}: ButtonProps) {
    return (
        <button className={`flex items-center gap-2 font-semibold text-left px-2 py-1 text-sm text-stone-500 
            ${hasHover? 'hover:bg-pink-50 hover:text-pink-500 transition duration-150 ease-in-out' : ''} 
            ${isRounded? 'rounded-md': ''} truncate ${className}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            type={type}
        >
            {children}
        </button>
    )
}

type PrimitiveButtonProps = ButtonProps & { disabled?: boolean };

export function PrimitiveButton({ children, className, onClick, onMouseEnter, onMouseLeave, type, disabled}: PrimitiveButtonProps) {
    return (
        <button className={`flex items-center gap-2 font-semibold text-left px-2 py-1 text-sm truncate ${className}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            type={type}
            disabled={disabled}
        >
            {children}
        </button>
    )
}