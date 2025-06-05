import { useContext, useEffect, useRef, useState } from 'react';
import { TableDataDefault } from 'shared/interfaces/Data/document-interface';
import { produce } from 'immer';
import { Plus, Copy, Table as TableIcon, Trash, LucideProps, NotebookTabs, Ellipsis } from 'lucide-react';
import { useDataStore } from 'src/store';
import { TableInfoContext } from '../Table/table';
import { useSaveDocument } from 'shared/api/api-route';
import { TableDropdown } from '../Dropdown/table-dropdown';
import { DropdownSettings } from '../Dropdown/table-settings-dropdown';
import { createPortal } from 'react-dom';
import { useClickDropdown } from 'src/features/tables/hooks/dropdown/use-clickDropdown';
type DataTableNavProps = {
    checked_list: React.MutableRefObject<number>[];
    setCheckedList: React.Dispatch<React.SetStateAction<React.MutableRefObject<number>[]>>;
}
export function DataTableNav({ 
    checked_list,
    setCheckedList
}: DataTableNavProps) {

    const root = document.getElementById('root') as HTMLElement;
    const { document_id, sheet_name, table_data, table_index } =  useContext(TableInfoContext);
    const saveDocument = useSaveDocument();
    const addTable = useDataStore(state => state.addTable);
    const setTable = useDataStore(state => state.setTable);
    const deleteTable = useDataStore(state => state.removeTable);
    const getDocument = useDataStore(state => state.getDocument);
    const [ table_title, setTableTitle ] = useState(table_data.headers.title);
    const [ table_num, setTableNum ] = useState(table_data.headers.number);
    const [ table_type, setTableType ] = useState(table_data.type);
    const [ is_settings_open, setSettingsOpen ] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const position = useRef<DOMRect | undefined>(undefined);

    useEffect(() => {
        position.current = ref.current?.getBoundingClientRect();
    }, [ref.current, is_settings_open]);

    useEffect(() => {
        setTableType(table_data.type);
    }, [table_data.type]);
    
    useEffect(() => {
        setTableTitle(table_data.headers.title);
    }, [table_data.headers.title]);

    useEffect(() => {
        setTableNum(table_data.headers.number);
    }, [table_data.headers.number]);

    useClickDropdown({
        ref,
        dropdownRef,
        isOpen: is_settings_open,
        setIsOpen: setSettingsOpen,
        position
    });

    const default_table = TableDataDefault;
    const copy_table = {
        name: "New Table",
        type: table_data.type,
        headers: {
            title: "",
            number: ""
        },
        content: {
            headers: [...table_data.content.headers],
            rows: [new Array(table_data.content.headers.length).fill('')]
        },
        column_widths: [...table_data.column_widths]
    }

    const handleOnSubmit = async () => {
        if(table_title === table_data.headers.title && table_num === table_data.headers.number) return;
        // Set cursor to loading
        window.document.body.style.cursor = 'wait';
        const new_table = produce(table_data, (draft) => {
            draft.headers.title = table_title;
            draft.headers.number = table_num;
        });
        setTable(document_id, sheet_name, table_index, new_table);
        await saveDocument.mutateAsync({
            document: getDocument(document_id || ''),
            document_id: document_id || ''
        });
    }
    return (
    <div className='flex flex-row justify-between gap-2 px-2 py-1'>
        <div className='relative flex flex-row items-center gap-2'>
            <TableDropdown checked_list={checked_list} setCheckedList={setCheckedList}/>
            {(table_type === 'accounts-table' || table_type === 'titled-table') &&
            <>
                <TableIcon size={16} strokeWidth={2} color='#57534e' />
                <input 
                    type='text'
                    placeholder='Table Name'
                    value={table_title}
                    onChange={(e) => setTableTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { handleOnSubmit(); } }}
                    onBlur={handleOnSubmit}
                    className='w-[120px] truncate font-semibold text-stone-600 placeholder:text-stone-300' />
            </>}
            {(table_type === 'accounts-table') &&
            <>
                <NotebookTabs size={16} strokeWidth={2} color='#57534e' />
                <input 
                    type='text'
                    placeholder={(table_index + 1).toString()}
                    value={table_num}
                    onChange={(e) => setTableNum(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { handleOnSubmit(); } }}
                    onBlur={handleOnSubmit}
                    className='w-[120px] truncate font-semibold text-stone-600 placeholder:text-stone-300' />            
            </>
            }
        </div>
        <div className='relative flex flex-row items-center gap-2' ref={ref}> 
            <ButtonIcon icon={Plus} onClick={() => addTable(document_id, sheet_name, default_table)} />
            <ButtonIcon icon={Copy} onClick={() => addTable(document_id, sheet_name, copy_table)} />
            <ButtonIcon icon={Trash} onClick={() => deleteTable(document_id, sheet_name, table_index)} />
            <ButtonIcon icon={Ellipsis} onClick={() => setSettingsOpen(!is_settings_open)} />
            {createPortal(<DropdownSettings isOpen={is_settings_open} position={position} dropdownRef={dropdownRef}/> , root)}
        </div>
    </div>
    );
}

function ButtonIcon({ icon: Icon, onClick }: { icon: React.ComponentType<LucideProps>, onClick: () => void }) {
    return (
        <button className='px-1 py-1 hover:bg-stone-100 rounded-md text-stone-500' onClick={onClick}>
            <Icon size={16} strokeWidth={2} />
        </button>
    );
}