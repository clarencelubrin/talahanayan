import { useState } from 'react';
import { FileSpreadsheet, Plus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { documentInterface, SheetDataDefault } from 'shared/interfaces/Data/document-interface';
import { NavButton } from 'shared/ui/Buttons/nav-button';
import { MicroIconButton } from 'features/document/ui/Buttons/icon-button';
import { useDataStore } from 'src/store';

export function DocumentItemGroup({doc}: {doc: documentInterface}) {
    const addSheet = useDataStore(state => state.addSheet);
    const [show_sheets, setShowSheets] = useState(false);
    const [is_hovered, setIsHovered] = useState(false);

    const navigate = useNavigate();

    return (
        <>
            <NavButton
                onMouseEnter={()=>{setIsHovered(true)}}
                onMouseLeave={()=>{setIsHovered(false)}}
                className='w-full rounded-l-lg'
            >
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row gap-2 items-center' onClick={()=>{setShowSheets(!show_sheets)}}>
                        <MicroIconButton color='hover:bg-pink-100' 
                            icon={ChevronDown} 
                            iconClassName={`transition-transform ${show_sheets ? '': '-rotate-90'}`} />
                        <p>{doc.name}</p>                        
                    </div>
                    <AnimatePresence initial={false} mode="wait" onExitComplete={()=>null}>
                    {is_hovered && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className='flex flex-row gap-1'>
                            <MicroIconButton color='hover:bg-pink-100 text-pink-500' icon={Plus} onClick={() => {
                                addSheet(doc.id, `Sheet ${Object.keys(doc.sheets).length + 1}`, SheetDataDefault)
                            }} />
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </NavButton>
            {show_sheets && <div className='flex flex-row gap-2 ps-3.5'>
                <div className="w-1 bg-stone-200 rounded-full mx-auto my-2 shrink"></div>
                <div className='grow'>
                    {Object.keys(doc.sheets).map((sheet, sheet_index) => (
                        <NavButton className="w-full mb-1" key={sheet_index} icon={FileSpreadsheet} onClick={()=>{navigate(`/${doc.id}/${sheet}`)}}>{sheet}</NavButton>
                    ))}                      
                </div>
            </div>}
        </>
    )
}
