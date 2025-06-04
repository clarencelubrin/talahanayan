import { headerSettingsInterface } from "shared/interfaces/Data/document-interface";
export type DataHeaderCellProps = {
    column_index: number, 
    header: string, 
    widths_list: number[],
    settings: headerSettingsInterface,
    setWidthList: React.Dispatch<React.SetStateAction<number[]>>
    handleOnMouseUpResizer?: (e: React.MouseEvent) => void
}

export type DataTableCellProps = {
    cell_index: number, 
    row_index: number, 
    cell_data: string, 
    style: React.CSSProperties
}