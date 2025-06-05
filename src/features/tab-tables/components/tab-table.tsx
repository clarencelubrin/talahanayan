import { useState, useMemo, useEffect, useContext } from 'react';
import { AppContext } from 'src/App';
import { DataTable } from 'src/features/tables/components/Table/table';
import { useDataStore } from 'src/store';
import { AnimatePresence, motion } from 'framer-motion';
type TabTableProps = { 
    document_id: string,
    setScreenScrollDisabled: React.Dispatch<React.SetStateAction<boolean>>
};

export function TabTable({ document_id, setScreenScrollDisabled }: TabTableProps) {
    const data = useDataStore(state => state.data);
    const getSheet = useDataStore(state => state.getSheet);
    const getDocument = useDataStore(state => state.getDocument);
    const { drawer, closeDrawer } = useContext(AppContext);
    const [selected_sheet, setSelectedSheet] = useState(0);
    const sheetNames = useMemo(() => {
        const document = getDocument(document_id);
        return document ? Object.keys(document.sheets) : [];
    }, [data, document_id]);
    const [current_sheet, setCurrentSheet] = useState(getSheet(document_id, sheetNames[selected_sheet])?.tables || []);

    useEffect(()=>{
        setCurrentSheet(getSheet(document_id, sheetNames[selected_sheet])?.tables || []);
    }, [data, document_id, selected_sheet]);

    useEffect(()=>{
        if(drawer?.is_visible) closeDrawer();
    }, [selected_sheet])
    return (
        <div className='flex flex-col gap-4'>
            <div className='border-b border-stone-150'>
                <div className='flex flex-row ms-4 gap-1 overflow-x-auto scrollbar-hide'>
                    {sheetNames.map((sheet_name, index) => (
                        <button onClick={()=>setSelectedSheet(index)} key={index} 
                            className={`px-3 py-1.5 border-t border-s border-e text-truncate whitespace-nowrap
                                ${selected_sheet === index ? 
                                    'bg-pink-50 text-pink-500 border-pink-100' : 
                                    'bg-stone-50 text-stone-500 border-stone-100'} 
                                hover:bg-pink-100 hover:text-pink-500 font-semibold text-sm rounded-t-lg 
                                transition duration-150 ease-in-out`}>
                            {sheet_name}
                        </button>
                    ))}
                </div>
            </div>            
            <AnimatePresence initial={false} mode="wait" onExitComplete={()=>null}>
            <motion.div
                key={selected_sheet}                    
                className='flex flex-col gap-1'
            >
            {current_sheet.map((table, currentTable) => (
                    <DataTable 
                        key={currentTable}
                        table_data={table} 
                        document_id={document_id} 
                        sheet_name={sheetNames[selected_sheet]} 
                        setSheetScrollDisabled={setScreenScrollDisabled} 
                        table_index={currentTable}
                    />                    
            ))}    
            </motion.div>
            </AnimatePresence>            
            {current_sheet.length === 0 && <p>No tables found</p>}
        </div>
    )
}