import { useState } from 'react';
import { useParams } from 'react-router';
import { Sheet } from '../components/Sheet/sheet';
import { useDataStore, useTemporalStore, resetTempDifference } from 'src/store';
import { useSaveDocument } from 'src/shared/api/api-route';
import { useKeyPress } from 'src/features/tables/hooks/capture/use-keypress';
import { AnimatePresence, motion } from 'framer-motion';
// import { IconButton } from 'src/features/document/ui/Buttons/icon-button';
// import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
// import { useKickNoAccessToken } from 'src/shared/api/api-route';
import { Loading } from 'src/shared/components/Loading/loading';
// import { DocumentContext } from './document-layout';

export function SheetPage() {
    const navigate = useNavigate();
    const saveDocument = useSaveDocument();

    const data = useDataStore(state => state.data);
    const { document_id, sheet_name } = useParams<{ document_id: string, sheet_name: string }>();
    const { undo, redo } = useTemporalStore((state) => state);
    const getDocument = useDataStore(state => state.getDocument);
    // const { is_sidebar_open, setSidebarOpen } = useContext(DocumentContext);
    const [is_scroll_disabled, setScrollDisabled] = useState(false);

    if (!document_id || !sheet_name ) {
        // Handle the case where parameters are missing
        console.error('Missing URL parameters');
        return null;
    }
    // Keybinds
    useKeyPress(['Control', 'z'], () => {
        undo();
        // console.log(pastStates)
        resetTempDifference(); // Cleanup
    });
    useKeyPress(['Control', 'y'], () => {
        redo();
    });
    useKeyPress(['Control', 's'], async () => {
        await saveDocument.mutateAsync({
            document: getDocument(document_id || ''),
            document_id: document_id || ''
        });
    });
    // const handleToggleSidebar = () => {
    //     setSidebarOpen(!is_sidebar_open)
    //     localStorage.setItem('is_sidebar_open', is_sidebar_open ? 'false' : 'true')
    // }

    if (!data){
        return <Loading />
    }

    return (
        <div className={`relative flex flex-col ${is_scroll_disabled? 'overflow-y-hidden':'overflow-y-auto'} w-full`}>
            <div className='fixed flex flex-row gap-4 p-3 bg-white w-full z-10'>
                {/* <IconButton icon={is_sidebar_open ? PanelRightOpen : PanelRightClose} onClick={()=>handleToggleSidebar()} className='p-1' /> */}
                <p className='flex flex-row gap-1'>
                    <span onClick={()=>navigate(`/${document_id}`)} className='select-none text-sm font-bold text-stone-500 bg-stone-50 hover:text-pink-500 hover:bg-pink-50 px-3 py-1 rounded-md transition duration-150 ease-in-out'>{getDocument(document_id || '')?.name || 'Untitled Document'}</span>  
                    <span className='select-none text-sm font-bold text-stone-500 px-1 py-1 rounded-md'>/</span>
                    <span className='select-none text-sm font-bold text-stone-500 bg-stone-50 hover:text-pink-500 hover:bg-pink-50 px-3 py-1 rounded-md transition duration-150 ease-in-out'>{sheet_name || 'Untitled Sheet'}</span>
                </p>
            </div>
            <AnimatePresence initial={false} mode="wait" onExitComplete={()=>null}>
            <motion.div
                key={sheet_name}                    
            >
                <div className="min-h-screen w-full mx-auto">
                    <div className='h-16 w-full'></div>
                    <Sheet document_id={document_id} sheet_name={sheet_name} setScrollDisabled={setScrollDisabled}/>
                </div>
            </motion.div>
            </AnimatePresence>
        </div>
    )
}




