import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { Plus, Trash2 } from "lucide-react"
import { useDataStore } from "src/store"
import { NavButton } from "src/shared/ui/Buttons/nav-button"
import { useDeleteDocument } from "src/shared/api/api-route"
import { Loading } from "src/shared/components/Loading/loading"
import { DocumentContext } from "./document-layout"
import { TabTable } from "src/features/tab-tables/components/tab-table"
import { SheetDataDefault } from "shared/interfaces/Data/document-interface"
import { DocumentTitleInput } from "../components/Sheet/document-title"

export function DocumentPage(){
    const navigate = useNavigate();
    const deleteDocument = useDeleteDocument()
    const { setDocumentId, setDocumentName, setScreenScrollDisabled, document_name } = useContext(DocumentContext);
    const getDocument = useDataStore(state=>state.getDocument)
    const addSheet = useDataStore(state => state.addSheet);
    const data = useDataStore(state=>state.data);
    const { document_id } = useParams<{document_id:string}>()
    // const { is_sidebar_open, setSidebarOpen } = useContext(DocumentContext);
    const [ doc, setDoc ] = useState(getDocument(document_id || ''))

    useEffect(()=>{
        if(document_id){
            setDocumentName(getDocument(document_id)?.name || '')
            setDoc(getDocument(document_id))
            if (setDocumentId) {
                setDocumentId(document_id);
            }
        }
    }, [data, document_id])

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
    <div className="min-h-screen w-full">
        <div className='mx-auto p-4 sm:px-14 px-8 sm:py-10 py-6 flex flex-col gap-4'> 
            <DocumentTitleInput document_name={document_name} document_id={document_id ?? ''}/>
            <div className="flex flex-wrap gap-1">
                <NavButton icon={Plus} onClick={()=>addSheet(doc?.id || '', `Sheet ${Object.keys(doc?.sheets || {}).length + 1}`, SheetDataDefault)} className="w-fit">Add Sheet</NavButton>
                <NavButton icon={Trash2} onClick={()=>handleDeleteDocument()} className="w-fit">Delete Document</NavButton>
            </div>
        </div>
        {document_id && <TabTable document_id={document_id} setScreenScrollDisabled={setScreenScrollDisabled}/>}
    </div>
    )
}