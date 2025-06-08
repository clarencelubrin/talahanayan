import { Files, FilePlus } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDataStore } from "src/store";
import { NavButton } from "src/shared/ui/Buttons/nav-button";
import { useCreateNewDocument } from "src/shared/api/api-route";
// import { useKickNoAccessToken } from "src/shared/api/api-route";
import { useInitDataAsync } from "src/shared/api/api-route";
import { Loading } from "src/shared/components/Loading/loading";

export function HomePage(){
    const data = useDataStore(state => state.data);
    const navigate = useNavigate();

    const createNewDocument = useCreateNewDocument();
    const initDataAsync = useInitDataAsync();

    const handleCreateNewDocument = async () => {
        const {success, document_id} = await createNewDocument.mutateAsync();
        if(success){
            navigate(`/${document_id}`);
        } 
    }
    
    useEffect(()=>{
        initDataAsync()
    }, [])

    // Route to Log-in if not authenticated
    if (!data){
        return <Loading />
    }

    return (
        <div className="min-h-screen flex flex-col gap-3">
            <div className="bg-stone-100 h-[50vh] flex items-center border-b border-stone-200">
                <div className="max-w-[80vw] mx-auto w-full">
                    <h1 className="text-2xl font-semibold text-stone-600">Create new file</h1>
                    <div className="pt-4">
                        <button title="Create New" onClick={()=>handleCreateNewDocument()}>
                            <div className="bg-white border-2 border-stone-200 grid place-content-center text-pink-500 rounded-lg shadow-sm
                            hover:shadow-md transition duration-100 ease-in-out" style={{height: "15rem", width: "10rem"}}>
                                <FilePlus size={36} strokeWidth={2}/>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-white p-3">
                <div className="max-w-[80vw] mx-auto">
                    <h1 className="text-2xl font-semibold text-stone-600">Open recent files</h1>
                    <div className="flex flex-wrap gap-1 pt-4">
                        {data?.map((doc, index) => (
                            <LinkFile key={index} file={doc.id}>{doc.name}</LinkFile>
                        ))}
                        {data?.length === 0 && 
                            <div className="text-center text-stone-500 mt-2">No recent files found.</div>
                        }
                    </div>
                </div>                
            </div>
        </div>
    );
}

function LinkFile({file, children}: {file: string, children?: React.ReactNode}){
    const navigate = useNavigate();
    const handleOnClick = () => {
        navigate(`/${file}`);
    }
    return(
    <NavButton icon={Files} onClick={()=>handleOnClick()} className="w-full">
        {children}
    </NavButton>
    )
}