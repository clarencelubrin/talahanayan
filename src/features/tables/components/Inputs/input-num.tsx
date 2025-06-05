import { useEffect, useState, useContext } from 'react';
import { useTableScripts } from '../../hooks/scripts/use-tableScripts';
import { produce } from 'immer';
import { useDataStore } from 'src/store';
import { TableInfoContext } from '../Table/table';

export function InputNumber({ cell_index, row_index, cell_data }: {cell_index: number, row_index: number, cell_data: string}) {
    const { table_data, document_id, sheet_name, table_index } = useContext(TableInfoContext);
    const { getValue } = useTableScripts({ document_id, sheet_name, table_index, cell_index });
    const [formatted_value, setFormattedValue] = useState(cell_data);
    const setTable = useDataStore(state => state.setTable);
    
    const isDigit = (str: string) => {
        return /^\d+$/.test(str);
    }
    
    const updateCellValue = (new_value: string) => {
        if (new_value === cell_data) return; // No change in value, do nothing
        const last_key = new_value.slice(-1)
        if (!isDigit(last_key) && ![''].includes(last_key)) return;
        const new_table = produce(table_data, (draft) => {
            draft.content.rows[row_index][cell_index] = new_value;
        })
        setTable(document_id, sheet_name, table_index, new_table);
    }
    const setCellState = (new_value: string) => {
        if (new_value === undefined || new_value === null) {
            return;
        }
        const numericValue = new_value.replace(/\D/g, '');
        const { value } = getValue(row_index, cell_index, numericValue);
        setFormattedValue(value);
    }

    useEffect(() => {
        updateCellValue(formatted_value);
    }, [formatted_value])

    useEffect(() => {
        setCellState(formatted_value);
    }, [getValue]);

    useEffect(() => {
        setCellState(cell_data);
    }, [table_data.content.rows, document_id, sheet_name, table_index, cell_index, row_index]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCellState(e.target.value);
    }
    
    return (
        <input 
            type='text' 
            className='input-cell truncate' 
            value={formatted_value} 
            onChange={handleOnChange} 
        />
    )
}