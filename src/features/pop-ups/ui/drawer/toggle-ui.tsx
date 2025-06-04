import { createContext, useContext } from "react";
import { headerSettingsItemInterface } from "shared/interfaces/Data/document-interface";
type ToggleContextType = {
    toggled_options: headerSettingsItemInterface[], 
    setToggleOptions: React.Dispatch<React.SetStateAction<headerSettingsItemInterface[]>>
}
export const ToggleContext = createContext<ToggleContextType>({
    toggled_options: [], 
    setToggleOptions: () => {}
});
export function ToggleContainer({children, toggled_options, setToggleOptions}: {children?: React.ReactNode, toggled_options: headerSettingsItemInterface[], setToggleOptions: React.Dispatch<React.SetStateAction<headerSettingsItemInterface[]>>}){
    return (
        <ToggleContext.Provider value={{toggled_options, setToggleOptions}}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {children}
            </div>
        </ToggleContext.Provider>
    )
}
export function ToggleSelection({children, value, disabled=false}: {children?: React.ReactNode, value: string, disabled?: boolean}){
    const {toggled_options, setToggleOptions} = useContext(ToggleContext);

    const handleOnClick = () => {
        if (toggled_options.map(item => item.value).includes(value)) {
            setToggleOptions(toggled_options.filter(item => item.value !== value));
        } else {
            setToggleOptions([...toggled_options, { value, settings: {} }]);
        }
    }
    return (
        <div className={`flex flex-row items-center gap-2 select-none
            rounded-md px-3 py-2 text-sm font-semibold border border-stone-200 
            ${toggled_options.map(item => item.value).includes(value) ? 'bg-pink-50 text-pink-500' : 'text-stone-500'}
            ${disabled ? 'cursor-not-allowed bg-stone-50 text-stone-300/75' : 'cursor-pointer'}
            hover:shadow-sm transition duration-150 ease-in-out`}
            onClick={()=>{if(!disabled) handleOnClick()}}
        >
            {children}
        </div>
    )
}