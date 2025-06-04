import { useDataStore } from "src/store"
import { useState, useEffect, useContext } from "react"
import { AutoItalic, removeItalic } from "src/features/tables/hooks/scripts/functions/auto-italic";
import { AutoTab } from "src/features/tables/hooks/scripts/functions/auto-tab";
import { AutoDateFormat } from "src/features/tables/hooks/scripts/functions/auto-dateformat";
import { cleanNumber } from 'shared/utils/number';
import { TableInfoContext } from "../../components/Table/table";

export function useTableScripts({ document_id, sheet_name, table_index, cell_index}: { document_id: string, sheet_name: string, table_index: number, cell_index: number }) {
    // Table Row
    const data = useDataStore(state => state.data);
    const getTable = useDataStore(state => state.getTable);
    const getDocument = useDataStore(state => state.getDocument);
    const [ document, setDocument ] = useState(getDocument(document_id));
    const [ table, setTable ] = useState(getTable(document_id, sheet_name, table_index));
    const { scriptDisabled } = useContext(TableInfoContext);
    const getColumnSettings = (column_index: number) => {
        return table?.content.headers[column_index].settings;
    }
    const getUserLocaleDateFormat = (cell_index: number) => {
        const input_format = getColumnSettings(cell_index)?.column_formatting.find(format => ['datelong', 'dateshort', 'datelong-noyear', 'dateshort-noyear', 'datelong-month', 'dateshort-month', 'datenone'].includes(format.value))?.settings['metadata'] || ['auto'];
        switch (input_format[0]) {
            case 'DD-MM-YYYY':
                return 'DD-MM-YYYY';
            case 'MM-DD-YYYY':
                return 'MM-DD-YYYY';
            case 'YYYY-MM-DD':
                return 'YYYY-MM-DD';
            case 'auto':
            default:
                const testDate = new Date(2000, 0, 31); // January 31, 2000
                const formattedDate = new Intl.DateTimeFormat().format(testDate);
                if (formattedDate.startsWith('31')) {
                    return 'DD-MM-YYYY';
                } else if (formattedDate.startsWith('1') || formattedDate.startsWith('01')) {
                    return 'MM-DD-YYYY';
                }
                return 'YYYY-MM-DD'; // Default fallback
        }
    };
    const [ userLocaleDateFormat, setUserLocaleDateFormat ] = useState(getUserLocaleDateFormat(cell_index));
    useEffect(() => {
        setUserLocaleDateFormat(getUserLocaleDateFormat(cell_index));
    },[table?.content.headers[cell_index].settings.column_formatting, cell_index])

    useEffect(() => {
        setTable(getTable(document_id, sheet_name, table_index));
        setDocument(getDocument(document_id));
    }, [data, document_id, sheet_name, table_index]);

    const getValue = (row_index: number, cell_index: number, cell_value: string, date_obj?: {day?: string, month?: string, year?: string}) => {
        if (scriptDisabled) return { value: cell_value, className: '' }; // Kill switch to disable formatting
        const column = table?.content.headers[cell_index]
        // Default value
        let value = cell_value;     // For value
        let className = '';         // For styling

        if (column?.settings.column_formatting && table) {
            switch (column.settings.column_type) {
                case 'text':
                // P/R auto complete
                const auto_pr_metadata_text = column.settings.column_calculation.find(item => item.value === 'auto-pr');
                if(auto_pr_metadata_text?.settings['table-dependency'] && auto_pr_metadata_text?.settings['pr'])
                {
                    const pr_index = parseInt(auto_pr_metadata_text?.settings['pr'][0]);
                    const pr_number = table.content.rows[row_index][pr_index];
                    const tableDependency: string = auto_pr_metadata_text.settings['table-dependency'][0];
                    const chart_of_accounts = document?.sheets[tableDependency]
                    const allRows = chart_of_accounts?.tables.flatMap(table => table.content.rows) || [];
                    const pr_pair = allRows.find(line => line[0] === pr_number)
                    if(pr_number){
                        if(pr_pair) value = pr_pair[1];
                        // console.log("PR PAIR", pr_pair);
                    }
                }

                // For Text formatting
                column?.settings.column_formatting.forEach((format, index) => {
                    if (format.value === 'autotab') {
                        value = AutoTab({column, table, row_index, value, format_index: index});
                    }
                    if (format.value === 'autoitalic') {
                        className = AutoItalic({column, table, className, row_index, format_index: index});
                    }
                    // Capitalization
                    if (format.value === 'uppercase') {
                        value = value.toUpperCase();
                    }
                    if (format.value === 'lowercase') {
                        value = value.toLowerCase();
                    }
                    if (format.value === 'capitalize') {
                        value = value.replace(/\b\w/g, (char: string) => char.toUpperCase());
                    }
                });
                break;
                case 'date':
                    if (!date_obj) break;
                    value = AutoDateFormat({column, date_obj: { day: date_obj?.day || '', month: date_obj?.month || '', year: date_obj?.year || '' }, userLocaleDateFormat});
                break;
                case 'number':
                    // P/R auto complete
                    const auto_pr_metadata_number = column.settings.column_calculation.find(item => item.value === 'auto-pr');
                    // console.log("AUTO PR", auto_pr_metadata_number, column.settings.column_calculation);
                    if(auto_pr_metadata_number && auto_pr_metadata_number?.settings['table-dependency'] && auto_pr_metadata_number?.settings['text'])
                    {
                        const pr_index = parseInt(auto_pr_metadata_number?.settings['text'][0]);
                        const pr_text = removeItalic(table.content.rows[row_index][pr_index]).trim();
                        const tableDependency: string = auto_pr_metadata_number.settings['table-dependency'][0];
                        const chart_of_accounts = document?.sheets[tableDependency]
                        const allRows = chart_of_accounts?.tables.flatMap(table => table.content.rows) || [];
                        const pr_pair = allRows.find(line => line[1] === pr_text)
                        if(pr_text){
                            if(pr_pair) {
                                value = pr_pair[0]
                            }
                            else if (allRows.find(line => line[0] === value) !== undefined) {
                                value = '';
                            }
                            // console.log("PR PAIR", pr_pair);
                        } 
                        // console.log("PR PAIR", pr_pair, value, allRows.find(line => line[0] === value) !== undefined);
                    }
                    // console.log(document);
                    // For Number formatting
                    const num_formats = column?.settings.column_formatting.map((format) => format.value);
                    value = handleNumberFormatting(value, num_formats);
                    break;
                case 'money':
                    const money_formats = column?.settings.column_formatting.map((format) => format.value);
                    const calculation = column?.settings?.column_calculation[0];
                    const debit_idx = calculation?.settings && calculation.settings['debit'] ? parseInt(calculation.settings['debit'][0] || '') : -1;
                    const credit_idx = calculation?.settings && calculation.settings['credit'] ? parseInt(calculation.settings['credit'][0] || '') : -1;
                    let is_positive = true;
                    // console.log("INDEX", debit_idx, credit_idx, calculation);
                    // Handle money calculation
                    if(calculation?.value === 'balance' && (debit_idx >= 0 && credit_idx >= 0))
                    {
                        // set value to the calculated value
                        const getSumOfArray = (array: string[][], idx: number) => {
                            let sum = 0;
                            array.forEach(row => sum = sum + parseFloat(stringToDecimal(row[idx] || '0').replace(/\,/g, '')));
                            return sum;
                        }
                        const sum_of_debit = getSumOfArray(table?.content.rows.slice(0, row_index + 1), debit_idx);
                        const sum_of_credit = getSumOfArray(table?.content.rows.slice(0, row_index + 1), credit_idx);
                        value = (sum_of_debit - sum_of_credit).toFixed(2);
                        is_positive = ((sum_of_debit - sum_of_credit) >= 0);
                    // console.log("IM FROM SCRIPT", getColumnSettings(cell_index))

                    }
                    // Remove money sign if any
                    value = handleNumberFormatting(cleanNumber(value), money_formats);
                    if (money_formats.includes('moneysign')) {
                        if(is_positive) value = value ? `₱${value}` : '';
                        else value = value ? `-₱${value}` : '';
                    }
                    break;
            }
        }
        return { value, className };
    }
    return { getValue, userLocaleDateFormat };
}

function handleNumberFormatting(value: string, formats: string[]) {
    if (formats.includes('comma') && formats.includes('decimal')) {
        value = stringToDecimal(value);
    }
    else if (formats.includes('decimal')) {
        value = stringToDecimal(value).replace(/\,/g, '');
    } 
    else if (formats.includes('comma')) {
        value = parseInt(value).toLocaleString();
        if (value === 'NaN') value = '';
    }                    
    else {
        value = value.replace(/\./g, '');
    }
    return value;
}

function stringToDecimal(value: string) {
    let float_value = parseFloat(value.replace(/[.,]/g, ''));
    if(parseFloat(value.replace(/[,]/g, '')) < 1)
    {
        // Handle 0.xx numbers
        return value;
    }
    if (float_value < 100){
        value = float_value.toLocaleString();
    }
    else {
        value = (float_value/100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (value === 'NaN') {
            value = '';
        }
    }
    return value
}