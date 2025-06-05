import { tableDataInterface } from 'src/shared/interfaces/Data/document-interface';
export type tableInfoContext = {
    table_data: tableDataInterface,
    document_id: string,
    sheet_name: string,
    table_index: number,
    scriptDisabled: boolean
}

export type tableFunctionContext = {
    handleAddRow: () => void
    handleAddRowatIndex: (index: number) => void
    setDropdownList: React.Dispatch<React.SetStateAction<HTMLElement[]>>
    setScrollDisabled: React.Dispatch<React.SetStateAction<boolean>>
    setScriptDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

export type DataTableProps = {
    table_data: tableDataInterface, 
    document_id: string, 
    sheet_name: string, 
    table_index: number,
    scrollDisabled?: boolean,
    setSheetScrollDisabled: React.Dispatch<React.SetStateAction<boolean>>
}