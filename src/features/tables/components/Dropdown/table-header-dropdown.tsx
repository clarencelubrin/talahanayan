import { useContext, useState, useEffect } from 'react';
import { produce } from 'immer';
import { Settings2, Trash2 } from 'lucide-react';
import { TableDropdown } from 'shared/ui/Dropdown/dropdown-ui';
import { NavButton } from 'shared/ui/Buttons/nav-button';
import { useDataStore } from 'src/store';
import { TableInfoContext, TableFunctionContext } from '../../../tables/components/Table/table';
import { AppContext } from 'src/App';
import { headerContentInterface } from 'shared/interfaces/Data/document-interface';

type DropdownProps = {
    column: headerContentInterface 
    isOpen: boolean;
    value: string;
    dropdownRef: React.RefObject<HTMLDivElement>;
    column_index: number;
    position: React.MutableRefObject<DOMRect | undefined>;

}
export function TableHeaderDropdown({column, isOpen, value, dropdownRef, column_index, position}: DropdownProps){
    const [ text, setText ] = useState(value);
    const { table_data, document_id, sheet_name, table_index } = useContext(TableInfoContext);
    const { setDropdownList } = useContext(TableFunctionContext);
    const { openDrawer } = useContext(AppContext);
    const removeColumn = useDataStore(state => state.removeColumn);
    const setTable = useDataStore(state => state.setTable);

    // useEffect(() => {
    //     // Register to the dropdown list if it is open
    //     if (isOpen) {
    //         setDropdownList((prev) => {
    //             return [...prev, dropdownRef.current as HTMLElement];
    //         });
    //     }
    //     // Else, remove from the list
    //     else {
    //         setDropdownList((prev) => {
    //             return prev.filter((value) => value !== dropdownRef.current);
    //         });
    //     }
    // }, [isOpen]);

    useEffect(() => {
    const dropdownElement = dropdownRef.current;
    if (!dropdownElement) return;

        setDropdownList(prev => {
            if (isOpen && !prev.includes(dropdownElement)) {
                return [...prev, dropdownElement];
            } else if (!isOpen && prev.includes(dropdownElement)) {
                return prev.filter(el => el !== dropdownElement);
            }
            return prev;
        });
    }, [isOpen, dropdownRef]);

    useEffect(() => {
        setText(value)
    }, [value])

    // Edit column name
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }
    // Submit column name
    const handleOnSubmit = () => { 
        const new_table = produce(table_data, (draft) => {
            draft.content.headers[column_index].value = text
        })
        setTable(document_id, sheet_name, table_index, new_table);
    }
    // Delete column
    const handleOnClickDelete = () => {
        removeColumn(document_id, sheet_name, table_index, column_index);
    }
    // Edit column settings
    const handleOnClickEdit = () => {
        openDrawer({is_visible: true, column, column_location: {document_id, sheet_name, table_index, column_index}, table_data});
    }
    return (
        <TableDropdown isOpen={isOpen} ref={dropdownRef} position={position}>
            <div className="flex flex-col p-1 gap-1 bg-white border border-stone-200 rounded-md drop-shadow-lg">
                <input 
                    type="text" value={text} 
                    onChange={(e) => {handleOnChange(e)}} 
                    onKeyDown={(e) => { if (e.key === 'Enter') handleOnSubmit(); }}
                    onBlur={handleOnSubmit}
                    className='px-2 py-1 text-sm font-semibold text-stone-500 border border-stone-200 rounded-md'
                />
                <NavButton icon={Settings2} onClick={() => handleOnClickEdit()} id='table-header-dropdown-edit'>
                    Edit
                </NavButton>
                <hr />
                <NavButton icon={Trash2} onClick={handleOnClickDelete}>
                    Delete
                </NavButton>
            </div>
        </TableDropdown>            
    )
}