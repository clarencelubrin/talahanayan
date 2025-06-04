import { tableDataInterface } from 'src/shared/interfaces/Data/document-interface';
export type DataRowProps = {
    row: string[],
    row_index: number,
    is_hovered_list: boolean[],
    width_list: number[],
    checked_list: React.MutableRefObject<number>[],
    setCheckedList: React.Dispatch<React.SetStateAction<React.MutableRefObject<number>[]>>,
    setIsHoveredList: (value: boolean[]) => void,
    is_checked_all: boolean
    content: tableDataInterface['content']
}
export type DataHeaderRowProps = {
    content: tableDataInterface['content'],
    width_list: number[],
    checked_list: React.MutableRefObject<number>[];
    setWidthList: React.Dispatch<React.SetStateAction<number[]>>,
    setCheckAll: React.Dispatch<React.SetStateAction<boolean>>
}