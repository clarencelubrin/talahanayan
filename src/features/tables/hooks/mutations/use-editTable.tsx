import { useDataStore } from 'src/store';
import { produce } from 'immer';
import { tableDataInterface } from 'src/shared/interfaces/Data/document-interface';
type useEditTableProps = {
    table_data: tableDataInterface, 
    document_id: string, 
    sheet_name: string, 
    table_index: number,
    is_hovered_list: boolean[],
    is_checked_all: boolean,
    setIsHoveredList: React.Dispatch<React.SetStateAction<boolean[]>>,
    setIsCheckedAll: React.Dispatch<React.SetStateAction<boolean>>,
    setCheckedList: React.Dispatch<React.SetStateAction<React.MutableRefObject<number>[]>>,
}
export function useEditTable({ 
    table_data,
    document_id, 
    sheet_name, 
    table_index,
    is_hovered_list,
    setIsHoveredList,
    is_checked_all,
    setIsCheckedAll,
    setCheckedList,
}: useEditTableProps) {
    const addRow = useDataStore(state => state.addRow);
    const addRowatIndex = useDataStore(state => state.addRowatIndex);
    const content = table_data.content;
    
    const handleAddRow = () => {
        addRow(document_id, sheet_name, table_index, new Array(content.headers.length).fill(''));
        setIsHoveredList(produce(is_hovered_list, draft => {
            draft.push(false);
        }));
        if (is_checked_all) {
            // Reset checked_list and is_checked_all
            setIsCheckedAll(false)
            setCheckedList([]);
        };
    }

    const handleAddRowatIndex = async (index: number) => {
        addRowatIndex(document_id, sheet_name, table_index, new Array(content.headers.length).fill(''), index);
        setIsHoveredList(produce(is_hovered_list, draft => {
            draft.splice(index + 1, 0, false);
        }));
        if (is_checked_all) {
            // Reset checked_list and is_checked_all
            setIsCheckedAll(false)
            setCheckedList([]);
        };
    }
    return {handleAddRow, handleAddRowatIndex}
}