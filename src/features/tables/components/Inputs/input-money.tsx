import { useEffect, useState, useContext } from 'react';
import { useTableScripts } from '../../hooks/scripts/use-tableScripts';
import { produce } from 'immer';
import { useDataStore } from 'src/store';
import { TableInfoContext } from '../Table/table';
import { isDigit } from 'shared/utils/number';
import { cleanNumber } from 'shared/utils/number';

export function InputMoney({ cell_index, row_index, cell_data }: {cell_index: number, row_index: number, cell_data: string}) {
    const { table_data, document_id, sheet_name, table_index } = useContext(TableInfoContext);
    const { getValue } = useTableScripts({ document_id, sheet_name, table_index, cell_index });
    const [formatted_value, setFormattedValue] = useState(cell_data);
    const setTable = useDataStore(state => state.setTable);
    
    useEffect(() => {
        const { value } = getValue(row_index, cell_index, cell_data.replace(/,/g, ''));
        setFormattedValue(value);
    }, [table_data, cell_data, cell_index, row_index, getValue])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const new_value = cleanNumber(e.target.value)
        const last_key = new_value.slice(-1)
        if (!isDigit(last_key) && ![''].includes(last_key)) return;
        const new_table = produce(table_data, (draft) => {
            draft.content.rows[row_index][cell_index] = new_value;
        })
        setTable(document_id, sheet_name, table_index, new_table);
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