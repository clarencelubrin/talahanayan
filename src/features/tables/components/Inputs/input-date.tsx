import { useContext, useEffect, useRef, useState } from "react";
import { produce } from "immer";
import { TableInfoContext } from "../Table/table";
import { useDataStore } from "src/store";
import { useTableScripts } from 'src/features/tables/hooks/scripts/use-tableScripts';
import { dateToString } from "src/features/tables/hooks/scripts/functions/auto-dateformat";

const parseDate = (date: string, userDateFormat: string) => {
    const date_arr = date.split('-');
    switch(userDateFormat) {
        case 'MM-DD-YYYY':
            return {month: date_arr[0], day: date_arr[1], year: date_arr[2]};
        case 'DD-MM-YYYY':
            return {day: date_arr[0], month: date_arr[1], year: date_arr[2]};
        case 'YYYY-MM-DD':
            return {day: date_arr[2], month: date_arr[1], year: date_arr[0]};
        default:
            return {month: date_arr[0], day: date_arr[1], year: date_arr[2]};
    }
}
export function InputDate({ cell_index, row_index, cell_data }: { cell_index: number, row_index: number, cell_data: string }){
    const { table_data, document_id, sheet_name, table_index } = useContext(TableInfoContext);
    const { getValue, userLocaleDateFormat } = useTableScripts({ document_id, sheet_name, table_index, cell_index });

    const [value, setValue] = useState(cell_data);
    const [formatted_value, setFormattedValue] = useState('');
    const [is_formatted, setIsFormatted] = useState(true);
    const [userDateFormat, setUserDateFormat] = useState(userLocaleDateFormat);

    const old_date = useRef(parseDate(value, userDateFormat));
    const [date_obj, setDateObj] = useState(parseDate(value, userDateFormat));

    const setTable = useDataStore(state => state.setTable);

    const isDigit = (str: string) => {
        return /^\d+$/.test(str);
    }

    useEffect(() => {
        const { value: formattedValue } = getValue(row_index, cell_index, value, date_obj);
        setFormattedValue(formattedValue);
    }, [table_data.content.headers[cell_index].settings.column_formatting, value, date_obj, userDateFormat])

    useEffect(() => {
        old_date.current = parseDate(value, userDateFormat);
        // Change the userDateFormat based on the column_formatting
        setUserDateFormat(userLocaleDateFormat);
    },[table_data.content.headers[cell_index].settings.column_formatting, cell_index])

    useEffect(() => {
        setValue(dateToString(old_date.current, userDateFormat));
    }, [userDateFormat])

    useEffect(() => {
        setDateObj(parseDate(value, userDateFormat));
    }, [value, userDateFormat])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let new_value = e.target.value;
        const last_key = new_value[new_value.length-1]
        const count_dash = Array.from(new_value).filter((char: string) => char === '-').length;

        if (new_value.length > 10) return;
        if (!isDigit(last_key) && !['', '-', ' '].includes(last_key) && e.target && (e.nativeEvent as InputEvent).inputType !== 'deleteContentBackward') return;
        
        switch(userDateFormat) {
            case 'MM-DD-YYYY':
            case 'DD-MM-YYYY':
                if ((count_dash < 2) && isDigit(new_value.slice(-3)) && new_value.length >= 3) {
                    // For the third input in the DD or MM, it replaces the last key with a dash
                    const new_subvalue = new_value.slice(0, -1)
                    new_value = new_subvalue + '-';
                } 
                else if ((count_dash === 2) && isDigit(new_value.slice(-5))){
                    // For the fifth input in the YYYY, it replaces the last key with a dash
                    new_value = new_value.slice(0, -1);
                }
                else if((count_dash < 2) && (new_value[new_value.length-2] !== '-')) {
                    // Auto-dash when 2 digits are entered for MM-DD
                    new_value = new_value.replace(' ', '-').replace(/\//g, '-');
                };
                break;
            case 'YYYY-MM-DD':
                if ((count_dash === 0) && isDigit(new_value.slice(-5)) && new_value.length >= 5){
                    // For the fifth input in the YYYY, it replaces the last key with a dash
                    new_value = new_value.slice(0, -1) + '-';
                }
                else if ((count_dash > 0) && isDigit(new_value.slice(-3))) {
                    // For the third input in the DD or MM, it replaces the last key with a dash
                    const new_subvalue = new_value.slice(0, -1)
                    new_value = new_subvalue + '-';
                } 
                else if((count_dash > 0) && (new_value[new_value.length-2] !== '-')) {
                    // Auto-dash when 2 digits are entered for MM-DD
                    new_value = new_value.replace(' ', '-').replace(/\//g, '-');
                };
                break;
        }
        // Handling dashes
        if (last_key === '-'){
            if (count_dash > 2) {
                // No more than 2 dashes
                new_value = new_value.slice(0, -1);
            }
            else if(new_value.length === 1) {
                // No dash at the start
                new_value = '';
            }
            else if(new_value[new_value.length-2] === '-') {
                // No duplicate dash
                new_value = new_value.slice(0, -1);
            }
        }
        new_value = new_value.trim();

        const new_table = produce(table_data, (draft) => {
            draft.content.rows[row_index][cell_index] = new_value;
        })
        setTable(document_id, sheet_name, table_index, new_table);
        setValue(new_value);
    }
    return(
        <input type="text" value={(is_formatted && value !== '') ? formatted_value : value} onChange={handleOnChange} 
            placeholder={userDateFormat}
            className={`input-cell truncate focus:placeholder-gray-400 placeholder-white`}
            onBlur={() => setIsFormatted(true)}
            onClick={() => setIsFormatted(false)}/>
    )
}