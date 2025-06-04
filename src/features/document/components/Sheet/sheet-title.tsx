import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { produce } from 'immer';
import { documentInterface } from 'src/shared/interfaces/Data/document-interface';
import { useDataStore } from 'src/store';
import { useSaveDocument } from 'src/shared/api/api-route';
import { TitleInputUI } from 'src/shared/ui/Input/title-input';
export function SheetTitleInput({sheet_name, document_id, className}: {sheet_name: string, document_id: string, className?: string}) {
    const [text, setText] = useState(sheet_name);
    const getDocument = useDataStore(state => state.getDocument);
    const setDocument = useDataStore(state => state.setDocument);
    const navigate = useNavigate();
    const saveDocument = useSaveDocument();

    useEffect(() => {
        setText(sheet_name);
    }, [sheet_name]);
    

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const sanitizedValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
        setText(sanitizedValue);
    }
    const handleOnSubmit = async () => {
        const new_sheet_name = text.trim();
        if(new_sheet_name === sheet_name) return;
        const new_document = produce(getDocument(document_id), (draft: documentInterface) => {
            draft.sheets[new_sheet_name] = draft.sheets[sheet_name];
            delete draft.sheets[sheet_name];
        });
        if (!new_document) return;
        setDocument(document_id, new_document); // Set document to zustand
        // Sync to backend
        await saveDocument.mutateAsync({
            document: getDocument(document_id || ''),
            document_id: document_id || ''
        }).then((response) => {
            if (response.success) {
                navigate(`/${document_id}`);
            }
        });
    }
    return (
        <TitleInputUI 
            className={className} 
            value={text} 
            onChange={handleOnChange} 
            onBlur={()=>handleOnSubmit()}
            onKeyDown={(e) => { if (e.key === 'Enter') { handleOnSubmit(); } }} 
        />
    )
}