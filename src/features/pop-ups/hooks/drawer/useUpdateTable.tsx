import { useDataStore } from 'src/store';
import { tableDataInterface } from 'src/shared/interfaces/Data/document-interface';
type UpdateTableType = {
    column_location: {document_id: string, sheet_name: string, table_index: number, column_index: number}
    new_table: tableDataInterface
}
export function useUpdateTable(){
    const setTable = useDataStore(state => state.setTable);
    const updateTable = ({column_location:{ document_id, sheet_name, table_index }, new_table}: UpdateTableType) => {
        setTable(document_id, sheet_name, table_index, new_table);
    }
    return { updateTable }
}