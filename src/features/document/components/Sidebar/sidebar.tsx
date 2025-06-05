import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { HomeIcon, SquareLibrary, BookMarked, Plus, SquareUserRound, PanelRightOpen, PanelRightClose } from 'lucide-react';
import { useCreateNewDocument } from 'shared/api/api-route';
import { NavButton } from 'shared/ui/Buttons/nav-button';
import { BasicSkeleton } from 'shared/ui/Skeleton/default-skeleton';
// import { useGetActiveUser } from 'shared/api/api-route';
import { IconButton } from 'src/features/document/ui/Buttons/icon-button';
import { DocumentItemGroup } from 'features/document/components/Sidebar/sidebar-section';
import { SidebarUserDropdown } from 'src/features/auth/components/Dropdown/sidebar-user-dropdown';
import { useDataStore } from 'src/store';

export function Sidebar({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    const navigate = useNavigate();
    const createNewDocument = useCreateNewDocument();
    // const getActiveUser = useGetActiveUser();
    const data = useDataStore(state => state.data);

    // useEffect(() => {
    //     if(localStorage.getItem('username') || localStorage.getItem('username') === '' || localStorage.getItem('username') === 'undefined'){
    //         let { data: user } = getActiveUser
    //         if (user) {
    //             localStorage.setItem('username', user.username || '');
    //         };
    //     }
    // }, []);

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
    const handleOnClickNewDocument = async () => {
        await createNewDocument.mutateAsync()
    }
    return (
        <>
        <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={()=>null}
        >
        {isOpen &&
        <motion.div className='sm:min-w-64 min-w-full h-screen bg-stone-50 p-2 select-none'
            key="sidebar"
            initial={{x: -300}}
            animate={{x: 0, transition: { ease: "easeInOut" }}}
            exit={{x: -300, transition: { ease: "easeInOut" }}}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex flex-col w-full gap-1">
                <div className='relative w-full'>
                    <NavButton icon={SquareUserRound} onClick={()=>setIsOpenDropdown(!isOpenDropdown)} hasHover={false}
                    className='w-full hover:bg-stone-100 hover:text-stone-500 transition duration-150 ease-in-out'    
                    >
                        @{localStorage.getItem('username')}
                    </NavButton>      
                    <SidebarUserDropdown isOpen={isOpenDropdown} />
                </div>
                <NavButton icon={HomeIcon} onClick={()=>handleOnClickHome()}>Home</NavButton>
                <NavButton icon={SquareLibrary}>Library</NavButton>
                <NavButton icon={BookMarked}>Documentation</NavButton>
                <p className='px-2 mt-4 py-1 text-xs font-bold text-stone-400'>Documents</p>
                {data?.map((doc, index) => (
                <DocumentItemGroup key={index} doc={doc} />
                ))}
                {!data &&
                <>
                    <BasicSkeleton className='w-full h-6'/> 
                    <BasicSkeleton className='w-full h-6'/> 
                    <BasicSkeleton className='w-full h-6'/> 
                </>}
                <NavButton icon={Plus} onClick={() => handleOnClickNewDocument()}>Create New</NavButton>
            </div>
        </motion.div>}
        </AnimatePresence>
        <div className="absolute bottom-4 left-4 z-50 sm:p-2 p-1 visible">
            <IconButton
            icon={isOpen ? PanelRightOpen : PanelRightClose}
            onClick={() => { isOpen ? setIsOpen(false) : setIsOpen(true) }}
            className='p-1 bg-white shadow-md'
            />
        </div>
        </>
    )
}


