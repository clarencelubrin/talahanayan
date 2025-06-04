import { createContext, useContext } from "react";
type SelectionContextType = {
    selected: string, 
    setSelected: React.Dispatch<React.SetStateAction<string>>
}
export const SelectionContext = createContext<SelectionContextType>({selected: '', setSelected: () => {}});
export function SelectionContainerString({children, selected, setSelected}: {children?: React.ReactNode, selected: string, setSelected: React.Dispatch<React.SetStateAction<string>>}) {
    return (
        <SelectionContext.Provider value={{selected, setSelected}}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {children}
            </div>
        </SelectionContext.Provider>
    )
}
export function BoxSelectionString({value, children, disabled=false}: {value:string, children?: React.ReactNode, disabled?: boolean}) {
    const {selected, setSelected} = useContext(SelectionContext);
    return (
        <div className={`flex flex-row items-center gap-2 select-none
            rounded-md px-3 py-2 text-sm font-semibold border border-stone-200 
            ${selected === value ? 'bg-pink-50 text-pink-500' : 'bg-white text-stone-500'}
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            hover:shadow-sm transition duration-150 ease-in-out`}
            onClick={() => {if(!disabled) setSelected(value)}}
        >
            {children}
        </div>
    )
}