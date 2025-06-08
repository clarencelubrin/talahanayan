import { useState, createContext } from "react"
import { Outlet } from "react-router"
import { Sidebar } from "../components/Sidebar/sidebar"
import { useSaveDocument } from "src/shared/api/api-route"
import { useKeyPress } from 'src/features/tables/hooks/capture/use-keypress';
import { useTemporalStore, resetTempDifference } from 'src/store';
import { IconButton } from "src/features/document/ui/Buttons/icon-button"
import { BookText, Save, Undo2, Redo2 } from "lucide-react"
import { NavButton } from "src/shared/ui/Buttons/nav-button"
import { useDataStore } from "src/store"
import { useNavigate } from "react-router"
type DocumentContextType = {
    is_sidebar_open: boolean,
    document_id: string
    screenScrollDisabled: boolean
    document_name: string
    sheet_name: string
    setSheetName: React.Dispatch<React.SetStateAction<string>>
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    setDocumentId: React.Dispatch<React.SetStateAction<string>>
    setScreenScrollDisabled: React.Dispatch<React.SetStateAction<boolean>>
    setDocumentName: React.Dispatch<React.SetStateAction<string>>
}
export const DocumentContext = createContext<DocumentContextType>({is_sidebar_open: true, sheet_name: '', setSheetName: () => {}, setSidebarOpen: () => {}, document_id: '', setDocumentId: () => {}, setScreenScrollDisabled: () => {}, setDocumentName: () => {}  , screenScrollDisabled: false, document_name: ''});
export function DocumentLayout() {
    const saveDocument = useSaveDocument();
    const getDocument = useDataStore(state=>state.getDocument)
    const navigate = useNavigate();
    const isSmallScreen = window.matchMedia('(max-width: 639px)').matches;
    const { undo, redo, pastStates, futureStates} = useTemporalStore((state) => state);
    const [ screenScrollDisabled, setScreenScrollDisabled ] = useState(false);
    const [ is_sidebar_open, setSidebarOpen ] = useState((localStorage.getItem('is_sidebar_open') === 'true' && !isSmallScreen) || false)
    const [ document_id, setDocumentId ] = useState<string>(localStorage.getItem('page')?.split('/')[1] || '')
    const [ document_name, setDocumentName ] = useState(getDocument(document_id || '')?.name || 'Untitled Document');
    const [ sheet_name, setSheetName ] = useState<string>('');
    
    // useEffect(() => {
    //     console.log(screenScrollDisabled, 'screenScrollDisabled');
    // }, [screenScrollDisabled]);
    const handleUndo = () => {
        undo();
        resetTempDifference(); // Cleanup
    }
    const handleRedo = () => {
        redo();
        // resetTempDifference(); // Cleanup
    }
    const handleSaveDocument = async () => {
        await saveDocument.mutateAsync({
            document: getDocument(document_id || ''),
            document_id: document_id || ''
        });
    }
        // Keybinds
    useKeyPress(['Control', 'z'], () => {
        handleUndo();
    });
    useKeyPress(['Control', 'y'], () => {
        handleRedo();
    });
    useKeyPress(['Control', 's'], async () => {
        await handleSaveDocument();
    });

    return (
        <DocumentContext.Provider 
            value={{
                is_sidebar_open, 
                document_id, 
                screenScrollDisabled, 
                document_name,
                sheet_name,
                setSheetName,
                setSidebarOpen, 
                setDocumentId, 
                setScreenScrollDisabled,
                setDocumentName
            }}>
            <div className='flex bg-stone-100 flex-row w-full h-screen overflow-y-hidden'>
                <Sidebar isOpen={is_sidebar_open} setIsOpen={setSidebarOpen}/>
                <div className={`w-full h-screen ${screenScrollDisabled ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                    <div className={`flex flex-col pb-4 `}>
                        <div className='relative fixed flex flex-row justify-between gap-4 px-4 py-3 w-full z-10'>
                            {document_id && 
                            <div className="flex flex-row items-center max-w-[50vw]">
                                {(document_name) && 
                                <NavButton icon={BookText} onClick={()=>navigate(`/${document_id}`)} className="w-fit">
                                    <span className="truncate">{document_name}</span>
                                </NavButton>}
                                <span className='select-none text-sm font-bold text-stone-500 px-1 py-1 rounded-md'>/</span>
                                {(sheet_name) && 
                                <NavButton icon={BookText} onClick={()=>navigate(`/${document_id}/${sheet_name}`)} className="w-fit">
                                    <span className="truncate">{sheet_name}</span>
                                </NavButton>}
                            </div>}
                            <div className="flex flex-row items-center justify-center gap-2 px-1 h-full">
                                <IconButton
                                    icon={Save}
                                    onClick={handleSaveDocument}
                                    className='p-1'
                                />
                                <IconButton
                                    icon={Undo2}
                                    onClick={handleUndo}
                                    disabled={pastStates.length === 0}
                                    className='p-1'
                                />
                                <IconButton
                                    icon={Redo2}
                                    disabled={futureStates.length === 0}
                                    onClick={handleRedo}
                                    className='p-1'
                                />
                            </div>
                        </div>
                        <div className="sm:px-4 md:px-6">
                            <div className={`flex flex-col w-full rounded-3xl bg-white border border-stone-200`}>
                                {/* Table Content*/}
                                <Outlet />
                            </div>                 
                        </div>      
                    </div>
                </div>
            </div>
        </DocumentContext.Provider>
    )
}