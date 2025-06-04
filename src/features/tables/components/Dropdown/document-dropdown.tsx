import { useState } from 'react';
import { FilePlus2, FileUp, FileJson2, FileSpreadsheet, Save, SquareFunction, Sheet } from 'lucide-react';
import { Dropdown } from 'shared/ui/Dropdown/dropdown-ui';
import { NavButton, NavToggle } from 'shared/ui/Buttons/nav-button';
import { useDataStore } from 'src/store';
import { useCreateNewDocument, useExportDocument } from 'src/shared/api/api-route';

type DropdownProps = {
    document_id: string;
    isOpen: boolean;
    handleSaveDocument: () => void;
}

export function DocumentDropdown({isOpen, document_id, handleSaveDocument}: DropdownProps){
    const getDocument = useDataStore(state => state.getDocument);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [isScriptMenuOpen, setIsScriptMenuOpen] = useState(false);
    const createNewDocument = useCreateNewDocument();
    const { exportJSON, exportExcel } = useExportDocument();
    return (
        <Dropdown isOpen={isOpen} align='right'>
            <div className='rounded-md bg-white drop-shadow-lg border border-stone-200 min-w-48'>
                <div className="flex flex-col p-1 gap-1">
                    <NavButton icon={FilePlus2} onClick={createNewDocument.mutateAsync}>
                        Create new
                    </NavButton>
                    <NavButton icon={Save} onClick={handleSaveDocument}>
                        Save document
                    </NavButton>
                    <NavToggle isToggled={isExportMenuOpen} icon={FileUp} onClick={()=>setIsExportMenuOpen(!isExportMenuOpen)}>
                        Export document
                    </NavToggle>
                    {isExportMenuOpen &&
                    <div className='flex flex-col p-1 gap-1 bg-stone-50'>
                        <NavButton icon={FileJson2} onClick={() => exportJSON(getDocument(document_id))}>
                            to JSON file
                        </NavButton>
                        <NavButton icon={FileSpreadsheet} onClick={() => exportExcel(document_id)}>
                            to Excel file
                        </NavButton>                
                    </div>}     
                    <NavToggle isToggled={isScriptMenuOpen} icon={SquareFunction} onClick={()=>setIsScriptMenuOpen(!isScriptMenuOpen)}>
                        Scripts
                    </NavToggle>
                    {isScriptMenuOpen &&
                    <div className='flex flex-col p-1 gap-1 bg-stone-50'>
                        <NavButton icon={Sheet} onClick={() => {}}>
                            Auto-Fill Ledger
                        </NavButton>               
                    </div>}   
                </div>
            </div>

        </Dropdown>            
    )
}