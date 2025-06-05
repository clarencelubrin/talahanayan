import { useState, useRef, createContext, useEffect, useTransition } from 'react';
import { Plus } from 'lucide-react' 
import { Table, TableHead, TableBody, Cell, AddRow } from 'src/features/tables/ui/Table/table-ui'
import { TableDataDefault } from 'src/shared/interfaces/Data/document-interface' 
import { DataTableNav } from 'src/features/tables/components/Navbar/table-nav'
import { DataRow, DataHeaderRow } from 'src/features/tables/components/Table/table-row'
import { DataTableProps, tableInfoContext, tableFunctionContext } from 'src/features/tables/types/Table/table-interface'
import { useEditTable } from '../../hooks/mutations/use-editTable';
import { useCaptureScroll } from 'src/features/tables/hooks/capture/use-captureScroll';

export const TableInfoContext = createContext<tableInfoContext>({
    table_data: TableDataDefault, 
    document_id: '', 
    sheet_name: '', 
    table_index: 0, 
    scriptDisabled: false
});
export const TableFunctionContext = createContext<tableFunctionContext>({
    handleAddRow: ()=>{},
    handleAddRowatIndex: ()=>{}, 
    setDropdownList: ()=>{},
    setScrollDisabled: ()=>{},
    setScriptDisabled: () => {}
});

export function DataTable({ table_data, document_id, sheet_name, table_index, setSheetScrollDisabled }: DataTableProps) {
    const content = table_data.content;
    const tableRef = useRef<HTMLDivElement>(null);
    
    // Table info state
    const [width_list, setWidthList] = useState<number[]>(table_data.column_widths || 150);

    // List of dropdowns
    const [dropdown_list, setDropdownList] = useState<HTMLElement[]>([]);
    // Hover state for each row
    const [is_hovered_list, setIsHoveredList] = useState<boolean[]>(() => new Array(content.rows.length).fill(false));
    const [checked_list, setCheckedList] = useState<React.MutableRefObject<number>[]>([]);
    const [is_checked_all, setIsCheckedAll] = useState<boolean>(false);

    // Settings
    const [ scrollDisabled, setScrollDisabled ] = useState(false);
    const [ scriptDisabled, setScriptDisabled ] = useState(false);
    // Handle Add Row
    const { handleAddRow: _handleAddRow, handleAddRowatIndex: _handleAddRowatIndex } = useEditTable({ table_data, document_id, sheet_name, table_index, is_hovered_list, setIsHoveredList, is_checked_all, setIsCheckedAll, setCheckedList });
    // Capture scroll position
    const { handleScroll } = useCaptureScroll();
    const [isPending, startTransition] = useTransition();
    const handleAddRow = () => {
        _handleAddRow();
    }
    const handleAddRowatIndex = (index: number) => {
        if (isPending) return; // Prevent adding row while transition is pending
        // setScriptDisabled(true); // Disable script before adding row
        startTransition(() => {
            _handleAddRowatIndex(index);
        });
        // await new Promise(resolve => setTimeout(resolve, 50)); // Wait for state to update
        // setScriptDisabled(false); // Re-enable script after adding row
    }
    useEffect(() => {
    // Update zustand store when state changes
        setWidthList(table_data.column_widths);
    }, [table_data, document_id, sheet_name, table_index]);

    useEffect(() => {
        if (dropdown_list.length > 0) {
            setScrollDisabled(true);
            setSheetScrollDisabled(true);
        } else {
            setScrollDisabled(false);
            setSheetScrollDisabled(false);
        }
    }, [dropdown_list]);

    // Context for Table Functions
    const TableFunctions = {
        handleAddRow,
        handleAddRowatIndex,
        setDropdownList,
        setScrollDisabled,
        setScriptDisabled
    }

    // Context for Table Info
    const [TableInfo, setTableInfo] = useState({
        table_data,
        document_id,
        sheet_name,
        table_index,
        scriptDisabled
    });

    useEffect(() => {
        setTableInfo({
            table_data,
            document_id,
            sheet_name,
            table_index,
            scriptDisabled
        });
    }, [table_data, document_id, sheet_name, table_index, scriptDisabled]);

    return (
        <TableFunctionContext.Provider value={TableFunctions}>
            <TableInfoContext.Provider value={TableInfo}>
                <div className={`p-4 sm:px-16 px-14 ${scrollDisabled? 'overflow-x-hidden':'overflow-x-auto'}`} onScroll={handleScroll} style={{scrollBehavior: 'smooth'}}>
                <Table ref={tableRef}>
                    <DataTableNav checked_list={checked_list} setCheckedList={setCheckedList}/>
                    <TableHead>
                        <DataHeaderRow content={content} width_list={width_list} checked_list={checked_list}
                            setWidthList={setWidthList} setCheckAll={setIsCheckedAll} />
                    </TableHead>
                    <TableBody>
                        {content.rows.map((row, row_index) => (
                            <DataRow key={row_index} row={row} row_index={row_index} checked_list={checked_list}
                                is_hovered_list={is_hovered_list} setIsHoveredList={setIsHoveredList} setCheckedList={setCheckedList}
                                is_checked_all={is_checked_all} content={content} width_list={width_list}/>
                        ))}
                        <AddRow>
                            <button className='flex flex-row items-center gap-2 px-2 py-2 hover:bg-stone-100' onClick={() => handleAddRow()}>
                                <Plus size={16} strokeWidth={2} color='#9ca3af'/>
                                <Cell className='p-0 border-0 text-stone-400 font-normal pe-2'>New row</Cell>   
                            </button>
                        </AddRow>
                    </TableBody>
                </Table>  
                </div>
            </TableInfoContext.Provider>     
        </TableFunctionContext.Provider>    
    )
}


