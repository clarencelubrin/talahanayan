import { forwardRef } from 'react';
import { TableDropdown } from 'shared/ui/Dropdown/dropdown-ui';
import { LucideProps } from 'lucide-react';
import { createContext, useContext } from 'react';
import { TableTypesInterface } from 'shared/interfaces/Data/document-interface';

export const DropdownSettingsUI = forwardRef<HTMLDivElement, {children: React.ReactNode, isOpen: boolean, position: React.MutableRefObject<DOMRect | undefined>}>(({children, isOpen, position}, ref) => {
    return (
        <TableDropdown isOpen={isOpen} position={position} ref={ref} align='right'>
            <div className="flex flex-col p-1 gap-1 bg-white rounded-md drop-shadow-md border border-stone-200">
                {children}  
            </div>
        </TableDropdown>
    )
});

type DropdownSettingsContentContextType = {
    value: TableTypesInterface;
    onSelect: (value: TableTypesInterface) => void;
}
const DropdownSettingsContentContext = createContext<DropdownSettingsContentContextType>({
    value:'untitled-table', 
    onSelect:()=>{}
});
export function DropdownSettingsContent({children, value, onSelect}: {children: React.ReactNode, value: TableTypesInterface, onSelect: (value: TableTypesInterface) => void}) {
    return (
        <DropdownSettingsContentContext.Provider value={{value, onSelect}}>
            <div className='grid grid-cols-3 gap-1 select-none'>
                {children}
            </div>
        </DropdownSettingsContentContext.Provider>
    )
}

export function DropdownSettingsLabel({children}: {children: React.ReactNode}) {
    return (
        <label className='mx-1 mt-1 text-xs font-semibold text-stone-500'>
            {children}
        </label>
    )
}

export function DropdownSettingsOption({name, value, icon: Icon}: {name: string, value: TableTypesInterface, icon: React.ComponentType<LucideProps>}) {
    const context = useContext(DropdownSettingsContentContext);
    return (
        <div className={`flex flex-col justify-center items-center gap-1 p-1 border
            ${(context.value === value) ? 'bg-pink-50 text-pink-500 border-stone-300' : 'bg-white text-stone-600 border-stone-200'} rounded-md aspect-square p-3 transition duration-150 ease-in-out`}
            onClick={()=>context.onSelect(value)}>
            <Icon size={32} />
            <p className='text-[10px] font-semibold'>{name}</p>
        </div> 
    )
}