import { useContext, useState } from 'react';
import { produce } from 'immer';
import { useDataStore } from 'src/store';
import { Table, Sheet, NotebookTabs } from 'lucide-react';
import { TableInfoContext, TableFunctionContext } from '../Table/table';
import { DropdownSettingsContent, DropdownSettingsLabel, DropdownSettingsOption, DropdownSettingsUI } from '../../ui/Settings/dropdown-settings';
import { TableTypesInterface } from 'shared/interfaces/Data/document-interface';
import { useRegisterDropdown } from 'src/features/tables/hooks/dropdown/use-registerDropdown';
type DropdownProps = {
    isOpen: boolean;
    position: React.MutableRefObject<DOMRect | undefined>;
    dropdownRef: React.RefObject<HTMLDivElement>;
}

export function DropdownSettings({isOpen, position, dropdownRef}: DropdownProps){
    const { document_id, sheet_name, table_index, table_data } = useContext(TableInfoContext);
    const { setDropdownList } = useContext(TableFunctionContext);
    const setTable = useDataStore(state => state.setTable);
    const [table_type, setTableType] = useState(table_data.type);

    useRegisterDropdown({isOpen, dropdownRef, setDropdownList});

    const handleOnSelect = (value: TableTypesInterface) => {
        setTable(document_id, sheet_name, table_index, produce(table_data, draft => {
            draft.type = value;
        }));
        setTableType(value);
    }
    return (
        <DropdownSettingsUI isOpen={isOpen} position={position} ref={dropdownRef}>
            <DropdownSettingsLabel>Table Type</DropdownSettingsLabel>
            <DropdownSettingsContent value={table_type} onSelect={(value)=>handleOnSelect(value)}>
                <DropdownSettingsOption name='Untitled' value='untitled-table' icon={Table} />
                <DropdownSettingsOption name='Titled' value='titled-table' icon={Sheet} />
                <DropdownSettingsOption name='Accounts' value='accounts-table' icon={NotebookTabs} />
            </DropdownSettingsContent>
        </DropdownSettingsUI>            
    )
}