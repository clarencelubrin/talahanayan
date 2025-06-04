import { useContext, useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Dropdown } from 'shared/ui/Dropdown/dropdown-ui';
import { NavButton } from 'shared/ui/Buttons/nav-button';
import { useDataStore } from 'src/store';
import { TableInfoContext } from '../../../tables/components/Table/table';

type DropdownProps = {
    checked_list: React.MutableRefObject<number>[];
    setCheckedList: React.Dispatch<React.SetStateAction<React.MutableRefObject<number>[]>>;
}

export function TableDropdown({checked_list, setCheckedList}: DropdownProps){
    const [isOpen, setIsOpen] = useState(false);
    const { document_id, sheet_name, table_index } = useContext(TableInfoContext);
    const removeMultipleRows = useDataStore(state => state.removeMultipleRows);

    useEffect(() => {
        setIsOpen(checked_list.length > 0);
    }, [checked_list]);

    // Delete rows
    const handleOnClickDelete = () => {
        removeMultipleRows(document_id, sheet_name, table_index, checked_list.map((value) => value.current));
        setCheckedList([]);
    }
    return (
        <Dropdown isOpen={isOpen} >
            <div className="flex flex-row p-1 gap-1 bg-white border border-stone-200 rounded-md drop-shadow-lg">
                <NavButton >
                    {checked_list.length} Selected
                </NavButton>
                <NavButton icon={Trash2} onClick={handleOnClickDelete}>
                    Delete
                </NavButton>
            </div>
        </Dropdown>            
    )
}