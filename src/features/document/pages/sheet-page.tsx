import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Sheet } from '../components/Sheet/sheet';
import { useDataStore } from 'src/store';
import { AnimatePresence, motion } from 'framer-motion';
import { Loading } from 'src/shared/components/Loading/loading';
import { DocumentContext } from '../pages/document-layout';

export function SheetPage() {
    const data = useDataStore(state => state.data);
    const { document_id, sheet_name } = useParams<{ document_id: string, sheet_name: string }>();
    const { setSheetName } = useContext(DocumentContext);
    const [is_scroll_disabled, setScrollDisabled] = useState(false);

    useEffect(() => {
        if(sheet_name)
        setSheetName(sheet_name);
        // Kick user if no access token
        // useKickNoAccessToken();
        return () => {
            setSheetName('');
        }
    }, [sheet_name, setSheetName]);


    if (!document_id || !sheet_name ) {
        // Handle the case where parameters are missing
        console.error('Missing URL parameters');
        return null;
    }

    if (!data){
        return <Loading />
    }

    return (
        <div className={`relative flex flex-col ${is_scroll_disabled? 'overflow-y-hidden':'overflow-y-auto'} w-full`}>
            <AnimatePresence initial={false} mode="wait" onExitComplete={()=>null}>
            <motion.div
                key={sheet_name}                    
            >
                <div className="min-h-screen w-full mx-auto">
                    <Sheet document_id={document_id} sheet_name={sheet_name} setScrollDisabled={setScrollDisabled}/>
                </div>
            </motion.div>
            </AnimatePresence>
        </div>
    )
}




