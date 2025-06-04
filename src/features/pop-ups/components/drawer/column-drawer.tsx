import { useEffect, useState } from "react";
import { TitleInputUI } from "shared/ui/Input/title-input";
import { NavButton } from "shared/ui/Buttons/nav-button";
import { Trash2, Plus } from "lucide-react";
import { ColumnTypeOptions, TextOptions, NumberOptions, MoneyOptions, DateOptions, CalculateMoney, CalculateText } from "./column-options";
import { DrawerUI, DrawerGroupUI, NavbarGroup, DrawerClose} from "../../ui/drawer/drawer-ui";
import { headerContentInterface } from "src/shared/interfaces/Data/document-interface";
import { produce } from "immer";
import { useUpdateTable } from "../../hooks/drawer/useUpdateTable";
import { headerSettingsItemInterface } from "src/shared/interfaces/Data/document-interface";
import { useDataStore } from "src/store";
import { TextProperties, DateProperties, BalanceProperties, AutoPRProperties} from "./column-properties";

export type ColumnDrawerProps = {
    is_visible: boolean
    column: headerContentInterface
    column_location: {document_id: string, sheet_name: string, table_index: number, column_index: number}
    closeDrawer: () => void
}
export function ColumnDrawer({
    is_visible,
    column,
    column_location,
    closeDrawer
}: ColumnDrawerProps){
    const { updateTable } = useUpdateTable();   
    const getTable = useDataStore(state => state.getTable);
    const getDocument = useDataStore(state => state.getDocument)
    const [table_data, setTableData] = useState(getTable(column_location.document_id, column_location.sheet_name, column_location.table_index));
    const [document_data, setDocumentData] = useState(getDocument(column_location.document_id));
    const [column_text, setColumnText] = useState(column.value);
    const [column_type, setColumnType] = useState(column.settings.column_type);
    const [calculate, setCalculate] = useState<headerSettingsItemInterface>(column.settings.column_calculation[0] || []);
    const [text_formatting, text_setFormatting] = useState<headerSettingsItemInterface[]>(column.settings.column_formatting);
    const [date_formatting, date_setFormatting] = useState<headerSettingsItemInterface>(column.settings.column_formatting[0] || {value: 'datenone', settings: {}});
    const [money_formatting, money_setFormatting] = useState<headerSettingsItemInterface[]>(column.settings.column_formatting);
    const [num_formatting, num_setFormatting] = useState<headerSettingsItemInterface[]>(column.settings.column_formatting);
    // Date
    const current_date = new Date();
    const month_long = current_date.toLocaleString('default', { month: 'long' });
    const month_short = current_date.toLocaleString('default', { month: 'short' });
    const day = current_date.getDate();
    const year = current_date.getFullYear();
    // Date Formats
    const date_long = `${month_long} ${day}, ${year}`;
    const date_short = `${month_short}. ${day}, ${year}`;
    const date_long_noyear = `${month_long} ${day}`;
    const date_short_noyear = `${month_short}. ${day}`;
    const date_long_month = `${month_long}`;
    const date_short_month = `${month_short}.`;

    useEffect(()=>{
        setTableData(getTable(column_location.document_id, column_location.sheet_name, column_location.table_index));
        setDocumentData(getDocument(column_location.document_id));
    }, [column_location])

    // Update local state when column changes
    useEffect(() => {
        setColumnText(column.value);
        setColumnType(column.settings.column_type);
        setCalculate(column.settings.column_calculation[0] || {value: '', settings: {}});
        text_setFormatting(column.settings.column_formatting);
        date_setFormatting(column.settings.column_formatting[0] || {value: 'datenone', settings: {}});
        money_setFormatting(column.settings.column_formatting);
        num_setFormatting(column.settings.column_formatting);
    }, [column])

    // Update zustand when settings changes
    /*
        TODO:
            - Sometimes it is reverting back to its past state
    */
    // -----------------------------------------
    useEffect(()=>{
        console.log("IM UPDATING", table_data);
        if (table_data){
            updateTable({column_location, new_table: produce(table_data, (draft) => {
                draft.content.headers[column_location.column_index].value = column_text;
                draft.content.headers[column_location.column_index].settings = {
                    column_type,
                    column_calculation: column_type === 'money' || column_type === 'text' || column_type === 'number' ? [calculate] : [{value: '', settings: {}}],
                    column_formatting: column_type === 'date' ? [date_formatting] : column_type === 'money' ? money_formatting : column_type === 'number' ? num_formatting : column_type === 'text' ? text_formatting : []
                }
            })});
        }
    }, [column_type, column_text, calculate, text_formatting, date_formatting, date_formatting.settings['metadata'], money_formatting, num_formatting, table_data, column_location, updateTable])

    // -----------------------------------------
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColumnText(e.target.value);
    }
    const handleOnSubmit = () => {
        if (table_data){
            const new_table = produce(table_data, (draft) => {
                draft.content.headers[column_location.column_index].value = column_text
            })
            updateTable({column_location, new_table});
        }
    }
    return(
        <DrawerUI is_visible={is_visible}>
            <DrawerClose onClick={()=>closeDrawer()} />
            <TitleInputUI 
                value={column_text} 
                placeholder="Untitled"
                onChange={handleOnChange}
                onKeyDown={(e) => { if (e.key === 'Enter') { handleOnSubmit(); } }}
            />
            {/* Column Navbar */}
            <NavbarGroup>
                <NavButton icon={Plus} onClick={()=>{}} className="w-fit">Add New Column</NavButton>
                <NavButton icon={Trash2} onClick={()=>{}} className="w-fit">Delete Column</NavButton>  
            </NavbarGroup>
            {/* Column Settings */}
            <DrawerGroupUI>
                <ColumnTypeOptions column_type={column_type} setColumnType={setColumnType} />
                {/* Formatting */}
                {column_type === 'text' && <TextOptions text_formatting={text_formatting} text_setFormatting={text_setFormatting} />}
                {column_type === 'number' && <NumberOptions num_formatting={num_formatting} num_setFormatting={num_setFormatting} />}
                {column_type === 'money' && <MoneyOptions money_formatting={money_formatting} money_setFormatting={money_setFormatting} />}
                {column_type === 'date' && <DateOptions date_formatting={date_formatting} date_setFormatting={date_setFormatting} dates={{date_long, date_short, date_long_noyear, date_short_noyear, date_long_month, date_short_month}} />}
                {/* Calculate */}
                {column_type === 'money' && <CalculateMoney calculate={calculate} setCalculate={setCalculate} />}
                {(column_type === 'text' || column_type === 'number') && <CalculateText calculate={calculate} setCalculate={setCalculate} />}
            </DrawerGroupUI>
            {/* Settings Properties */}
            <DrawerGroupUI>
                <p className="mt-2 text-sm font-semibold text-stone-700">Properties</p>
                {/* Text */}
                {column_type === 'text' && <TextProperties column_text={column_text} table_data={table_data} settings={text_formatting} text_setFormatting={text_setFormatting}/>}
                {column_type === 'date' && <DateProperties table_data={table_data} date_formatting={date_formatting} date_setFormatting={date_setFormatting} />}
                {(calculate.value === 'balance') && <BalanceProperties table_data={table_data} calculate={calculate} setCalculate={setCalculate}/>}
                {(calculate.value === 'auto-pr') && <AutoPRProperties table_data={table_data} document={document_data} calculate={calculate} setCalculate={setCalculate} column_type={column_type}/>}
                {(column_type === 'number') && <p className="text-xs text-stone-300">No settings selected.</p>}
                {(column_type === 'money' && calculate.value !== 'balance') && <p className="text-xs text-stone-300">No settings selected.</p>}
            </DrawerGroupUI>
        </DrawerUI>
    )
}
