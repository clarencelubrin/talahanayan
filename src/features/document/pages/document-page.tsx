import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { IconButton } from "src/features/document/ui/Buttons/icon-button"
import { Plus, Trash2, Undo2, Redo2, Save, Menu } from "lucide-react"
import { useDataStore } from "src/store"
import { NavButton } from "src/shared/ui/Buttons/nav-button"
import { useDeleteDocument } from "src/shared/api/api-route"
import { useSaveDocument } from "src/shared/api/api-route"
import { useKeyPress } from 'src/features/tables/hooks/capture/use-keypress';
import { useTemporalStore, resetTempDifference } from 'src/store';
import { Loading } from "src/shared/components/Loading/loading"
// import { DocumentContext } from "./document-layout"
import { TabTable } from "src/features/tab-tables/components/tab-table"
import { SheetDataDefault } from "shared/interfaces/Data/document-interface"
import { DocumentTitleInput } from "../components/Sheet/document-title"
import { DocumentDropdown } from "src/features/tables/components/Dropdown/document-dropdown"

export function DocumentPage(){
    const navigate = useNavigate();
    const deleteDocument = useDeleteDocument()
    const saveDocument = useSaveDocument();
    const getDocument = useDataStore(state=>state.getDocument)
    const addSheet = useDataStore(state => state.addSheet);
    const data = useDataStore(state=>state.data);
    const { undo, redo, pastStates, futureStates} = useTemporalStore((state) => state);
    const { document_id } = useParams<{document_id:string}>()
    // const { is_sidebar_open, setSidebarOpen } = useContext(DocumentContext);
    const [ document_name, setDocumentName ] = useState(getDocument(document_id || '')?.name || '')
    const [screenScrollDisabled, setScreenScrollDisabled] = useState(false);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);
    const [ doc, setDoc ] = useState(getDocument(document_id || ''))

    useEffect(()=>{
        if(document_id){
            setDocumentName(getDocument(document_id)?.name || '')
            setDoc(getDocument(document_id))
        }

    }, [data, document_id])

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

    const handleDeleteDocument = async () => {  
        // Delete document
        if(!document_id) return;
        await deleteDocument.mutateAsync(document_id).then(response => {
            if(response.success){
                navigate('/home')
            }
        });
    }

    if (!data){
        return <Loading />
    }

    return (
        <div className={`flex flex-col w-full ${screenScrollDisabled ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            <div className='relative fixed flex flex-row gap-4 p-3 bg-white w-full z-10'>
                <p className='flex flex-row gap-1'>
                    <span className='select-none text-sm font-bold text-stone-500 bg-stone-50 hover:text-pink-500 hover:bg-pink-50 
                        px-3 py-1 whitespace-none truncate rounded-md transition duration-150 ease-in-out'>{document_name}</span>  
                    <span className='select-none text-sm font-bold text-stone-500 px-1 py-1 rounded-md'>/</span>
                </p>
                <div className="absolute top-0 right-0 px-3 z-50 
                                flex flex-row items-center justify-center gap-2 bg-white h-full">
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
                    <div className="relative">
                        <IconButton
                            icon={Menu}
                            // iconClassName={`transition-transform ${isDropdownOpen ? '' : '-rotate-90'}`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className='p-1'
                        />
                    <DocumentDropdown document_id={document_id || ''} isOpen={isDropdownOpen} handleSaveDocument={handleSaveDocument}/>
                    </div>
                </div>
            </div>
            <div className="min-h-screen w-full">
                <div className='mx-auto p-4 sm:px-16 px-8 flex flex-col gap-4'> 
                    <DocumentTitleInput document_name={document_name} document_id={document_id ?? ''}/>
                    <div className="flex flex-wrap gap-1">
                        <NavButton icon={Plus} onClick={()=>addSheet(doc?.id || '', `Sheet ${Object.keys(doc?.sheets || {}).length + 1}`, SheetDataDefault)} className="w-fit">Add Sheet</NavButton>
                        <NavButton icon={Trash2} onClick={()=>handleDeleteDocument()} className="w-fit">Delete Document</NavButton>
                    </div>
                </div>
                {document_id && <TabTable document_id={document_id} setScreenScrollDisabled={setScreenScrollDisabled}/>}
            </div>
        </div>
    )
}