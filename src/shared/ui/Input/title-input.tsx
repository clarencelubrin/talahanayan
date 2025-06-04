type TitleInputUIProps = {
    className?: string;
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
}
export function TitleInputUI({className, value, placeholder, onBlur, onChange, onKeyDown}: TitleInputUIProps) {
    return (
        <input type="text" 
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            onBlur={onBlur}
            className={`font-bold text-3xl h-12 w-full placeholder:text-gray-200 truncate ${className}`} />
    )
}