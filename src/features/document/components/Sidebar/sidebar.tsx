import { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { HomeIcon, SquareLibrary, BookMarked, PanelRightOpen, PanelRightClose, ChevronDown } from 'lucide-react';
// import { useCreateNewDocument } from 'shared/api/api-route';
import { NavButton } from 'shared/ui/Buttons/nav-button';
import { MicroIconButton } from 'features/document/ui/Buttons/icon-button';
// import { useGetActiveUser } from 'shared/api/api-route';
import { IconButton } from 'src/features/document/ui/Buttons/icon-button';
import { DocumentItemGroup } from 'features/document/components/Sidebar/sidebar-section';
// import { SidebarUserDropdown } from 'src/features/auth/components/Dropdown/sidebar-user-dropdown';
import { useDataStore } from 'src/store';
import tala from "src/assets/Tala.png";
import { DocumentDropdown } from "src/features/tables/components/Dropdown/document-dropdown"
import { DocumentContext } from 'src/features/document/pages/document-layout';
import { useSaveDocument } from 'src/shared/api/api-route';

export function Sidebar({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [show_logo_dropdown, setShowLogoDropdown] = useState(false);
    const { document_id } = useContext(DocumentContext);
    const navigate = useNavigate();
    const saveDocument = useSaveDocument();
    const getDocument = useDataStore(state=>state.getDocument)
    const data = useDataStore(state => state.data);

    // Detect swipe left to close sidebar
    useEffect(() => {
        localStorage.setItem('is_sidebar_open', isOpen ? 'true' : 'false');
    }, [isOpen]);

    // Touch event handlers
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
        console.log('Touch start:', touchStartX.current, touchStartY.current);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.changedTouches[0];
        if (touchStartX.current !== null && touchStartY.current !== null) {
            const deltaX = touchStartX.current - touch.clientX;
            const deltaY = Math.abs(touchStartY.current - touch.clientY);
            if (deltaX > 80 && deltaY < 50) {
                // Swipe left detected
                setIsOpen(false);
                console.log('Swipe left detected, close sidebar');
            }
        }
        console.log('Touch end:', touch.clientX, touch.clientY);
        // Reset touch start values
        touchStartX.current = null;
        touchStartY.current = null;
        
    };
    const handleOnClickHome = () => {
        navigate('/home');
    }
    const handleSaveDocument = async () => {
        await saveDocument.mutateAsync({
            document: getDocument(document_id || ''),
            document_id: document_id || ''
        });
    }
    // const handleOnClickNewDocument = async () => {
    //     await createNewDocument.mutateAsync()
    // }
    return (
        <>
        <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={()=>null}
        >
        {isOpen &&
        <motion.div 
            className='max-lg:absolute max-lg:top-0 max-lg:left-0 max-lg:z-50 max-lg:shadow-lg
                sm:max-w-64 w-full max-w-full h-screen bg-white select-none border border-r-stone-200'
            key="sidebar"
            initial={{x: -300}}
            animate={{x: 0, transition: { ease: "easeInOut" }}}
            exit={{x: -300, transition: { ease: "easeInOut" }}}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex flex-col w-full gap-1 relative">
                <div className='relative'>
                    <div className='p-4 flex flex-row gap-1 color-pink-500' onClick={() => setShowLogoDropdown(!show_logo_dropdown)}>
                        <img src={tala} alt="Tala Logo" className="h-[32px] hover:scale-110 active:scale-125 transition duration-300 ease-in-out"/>
                        <MicroIconButton className='hover:bg-transparent'
                            icon={ChevronDown} 
                            color='text-pink-500 hover:bg-pink-100'
                            iconClassName={`transition-transform ${(!show_logo_dropdown) ? '-rotate-90': ''}`} />
                    </div>                    
                    <DocumentDropdown document_id={document_id || ''} isOpen={show_logo_dropdown} handleSaveDocument={handleSaveDocument}/>
                </div>

                <div className='px-3 pb-4 flex flex-col gap-1 max-w-full'>
                    <p className='px-2 text-xs font-bold text-stone-400'>Menu</p>
                    <NavButton icon={HomeIcon} onClick={()=>handleOnClickHome()}><span className='truncate'>Home</span></NavButton>
                    <NavButton icon={SquareLibrary}><span className='truncate'>Library</span></NavButton>
                    <NavButton icon={BookMarked}><span className='truncate'>Documentation</span></NavButton>                    
                </div>
                <div className='px-3 pb-4 flex flex-col gap-1 max-w-full'>
                    <p className='px-2 text-xs font-bold text-stone-400'>Documents</p>
                    {data?.map((doc, index) => (
                    <DocumentItemGroup key={index} doc={doc} setIsSidebarOpen={setIsOpen}/>
                    ))}                   
                </div>
            </div>
        </motion.div>}
        </AnimatePresence>
        <div className="absolute bottom-3 left-3 z-50 sm:p-2 p-1 visible">
            <IconButton
            icon={isOpen ? PanelRightOpen : PanelRightClose}
            onClick={() => { setIsOpen(!isOpen) }}
            className='p-1 bg-white shadow-md border border-stone-200'
            />
        </div>
        </>
    )
}


