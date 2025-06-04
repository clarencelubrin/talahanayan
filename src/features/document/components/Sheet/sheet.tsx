import { useEffect, useState } from 'react';
import { DataTable } from 'src/features/tables/components/Table/table';
import { SheetTitleInput } from '../Sheet/sheet-title';
import { BasicSkeleton } from 'shared/ui/Skeleton/default-skeleton';
import { useDataStore } from 'src/store';

export function Sheet({document_id, sheet_name, setScrollDisabled}: {document_id: string, sheet_name: string, setScrollDisabled: React.Dispatch<React.SetStateAction<boolean>>}) {
    const { data, getSheet } = useDataStore();
    const [sheet_data, setSheetData] = useState(() => getSheet(document_id || '', sheet_name || ''));
    useEffect(() => {
        setSheetData(getSheet(document_id || '', sheet_name || ''));
    }, [data, document_id, sheet_name]);

    if (!document_id || !sheet_name ) {
        // Handle the case where parameters are missing
        console.error('[ CLIENT ] Missing URL parameters');
        return null;
    }

    return(
        sheet_data ? (
            <div className='flex flex-col'> 
                <SheetTitleInput sheet_name={sheet_name} document_id={document_id} className='px-1 p-4 sm:px-16 px-8'/>
                {sheet_data?.tables.map((table, index) => (
                    <DataTable key={index} table_data={table} document_id={document_id} sheet_name={sheet_name} table_index={index} setSheetScrollDisabled={setScrollDisabled}/>
                ))}                 
            </div>
        ) : (
            <div className='flex flex-col gap-3 px-3'>
                <BasicSkeleton className='w-72 h-12'/>
                <BasicSkeleton className='w-full h-20'/>              
            </div>
        )
    ) 
}