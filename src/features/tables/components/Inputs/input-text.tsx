import { useContext, useEffect, useState } from 'react';
import { produce } from 'immer';
import { useDataStore } from 'src/store';
import { TableInfoContext } from 'src/features/tables/components/Table/table';
import { useTableScripts } from 'src/features/tables/hooks/scripts/use-tableScripts';
import { removeItalic, addItalic, strIsItalic } from '../../hooks/scripts/functions/auto-italic';

export function InputText({ cell_index, row_index, cell_data }: { cell_index: number, row_index: number, cell_data: string }) {
    const { table_data, document_id, sheet_name, table_index } = useContext(TableInfoContext);
    const [formatted_value, setFormattedValue] = useState(removeItalic(cell_data) || '');
    const [formatted_class, setFormattedClass] = useState(strIsItalic(cell_data) ? 'italic' : '');
    const { getValue } = useTableScripts({ document_id, sheet_name, table_index, cell_index });
    const setTable = useDataStore(state => state.setTable);

    const updateCellValue = (new_value: string) => {
        if (new_value === cell_data) {
            return;
        }
        const new_table = produce(table_data, (draft) => {
            if (formatted_class.includes('italic') && removeItalic(new_value) !== '') {
                new_value = addItalic(new_value);
            }
            else {
                new_value = removeItalic(new_value);
            }
            if (draft.content.rows[row_index])
            draft.content.rows[row_index][cell_index] = new_value;
        })
        setTable(document_id, sheet_name, table_index, new_table);
    }

    const calculateScript = (new_value: string) => {
        if(new_value === undefined || new_value === null) {
            return { value: '', className: '' };
        }
        return getValue(row_index, cell_index, new_value);
    }

    const handleValueUpdate = (new_value: string) => {
        const { value, className } = calculateScript(new_value);
        updateCellValue(value); // update store
        setFormattedValue(value);       // update local state
        setFormattedClass(className);   // update local class
    }

    const setLocalState = (new_value: string) => {
        const { value, className } = calculateScript(new_value);
        setFormattedClass(className);   // update local class
        if (value === formatted_value) return; // No change in value
        setFormattedValue(value);       // update local state
    }

    useEffect(() => {
        setLocalState(formatted_value);
    }, [getValue]);

    useEffect(() => {
        if (removeItalic(cell_data) !== formatted_value) {
            setLocalState(removeItalic(cell_data));
        }
    }, [
        table_data.content.rows,
        document_id,
        sheet_name,
        table_index,
        cell_index,
        row_index
    ]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleValueUpdate(e.target.value);
    }

    return (
        <input type="text" value={formatted_value} onChange={handleOnChange} 
            className={`input-cell truncate ${formatted_class}`}/>
    )
}
