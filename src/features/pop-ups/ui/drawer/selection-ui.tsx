import { createContext, useContext } from "react";
import { headerSettingsItemInterface } from "shared/interfaces/Data/document-interface";
type SelectionContextType = {
    selected: headerSettingsItemInterface, 
    setSelected: React.Dispatch<React.SetStateAction<headerSettingsItemInterface>>
}
export const SelectionContext = createContext<SelectionContextType>({
    selected: {value: '', settings: {}}, 
    setSelected: () => {}
});
export function SelectionContainer({children, selected, setSelected}: {children?: React.ReactNode, selected: headerSettingsItemInterface, setSelected: React.Dispatch<React.SetStateAction<headerSettingsItemInterface>>}) {
    return (
        <SelectionContext.Provider value={{selected, setSelected}}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {children}
            </div>
        </SelectionContext.Provider>
    )
}
export function BoxSelection({value, children}: {value:string, children?: React.ReactNode}){
    const {selected, setSelected} = useContext(SelectionContext);
    return (
        <div className={`flex flex-row items-center gap-2 select-none
            rounded-md px-3 py-2 text-sm font-semibold border border-stone-200 
            ${selected.value === value ? 'bg-pink-50 text-pink-500' : 'bg-white text-stone-500'}
            hover:shadow-sm transition duration-150 ease-in-out`}
            onClick={() => setSelected({value, settings: {}})}
        >
            {children}
        </div>
    )
}