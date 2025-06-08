import { useState } from 'react';
import { FileSpreadsheet, Plus, ChevronDown, BookText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { documentInterface, SheetDataDefault } from 'shared/interfaces/Data/document-interface';
import { NavButton } from 'shared/ui/Buttons/nav-button';
import { MicroIconButton } from 'features/document/ui/Buttons/icon-button';
import { useDataStore } from 'src/store';

export function DocumentItemGroup({doc, setIsSidebarOpen}: {doc: documentInterface, setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    const addSheet = useDataStore(state => state.addSheet);
    const [show_sheets, setShowSheets] = useState(false);
    const [is_hovered, setIsHovered] = useState(false);
    const is_mobile = window.matchMedia('(max-width: 639px)').matches;

    const navigate = useNavigate();

    return (
        <>
            <NavButton
                onMouseEnter={()=>{setIsHovered(true)}}
                onMouseLeave={()=>{setIsHovered(false)}}
                className='w-full rounded-l-lg max-w-full'
            >
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row gap-2 items-center w-5/6' onClick={()=>{setShowSheets(!show_sheets)}}>
                        <MicroIconButton color='hover:bg-pink-100' 
                            icon={is_hovered ? ChevronDown : BookText} 
                            iconClassName={`transition-transform ${(!show_sheets && is_hovered) ? '-rotate-90': ''}`} />
                        <p className='truncate'>{doc.name}</p>                        
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
            {show_sheets && 
            <div className='flex flex-row gap-2 ps-3.5 max-w-full w-full'>
                <div className="shrink-0 w-0.5 bg-stone-200 rounded-full mx-auto my-2 shrink"></div>
                <div className='grow max-w-full'>
                    {Object.keys(doc.sheets).map((sheet, sheet_index) => (
                        <NavButton className="w-full mb-1" key={sheet_index} icon={FileSpreadsheet} 
                            onClick={()=>{
                                if(is_mobile) {
                                    setIsSidebarOpen(false);
                                }
                                navigate(`/${doc.id}/${sheet}`)
                            }}>
                                <span className='truncate'>{sheet}</span>
                        </NavButton>
                    ))}                      
                </div>
            </div>}
        </>
    )
}
