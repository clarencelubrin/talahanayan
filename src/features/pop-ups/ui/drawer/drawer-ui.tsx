import { X } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";

export function DrawerUI({children, is_visible}: {children?: React.ReactNode, is_visible: boolean}){
    return (
        <AnimatePresence>
            {is_visible &&
            <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0, transition: { type: "easeinout" } }}
                exit={{ x: "100%", transition: { type: "easeinout" } }}
                id='drawer'
                className="fixed top-0 right-0 h-screen w-screen sm:w-[512px] bg-white shadow-md p-3 overflow-y-auto">
                <div className="flex flex-col p-4 gap-2">
                    {children}
                </div>
            </motion.div>}
        </AnimatePresence>

    )
}
export function DrawerGroupUI({children}: {children?: React.ReactNode}){
    return (
        <div className="flex flex-col gap-2">
            {children}
        </div>
    )
}
export function NavbarGroup({children}: {children?: React.ReactNode}){
    return (
        <div className="flex flex-wrap gap-2">
            {children}
        </div>
    )
}

export function DrawerClose({onClick}: {onClick: () => void}){
    return (
        <button onClick={onClick} className="absolute top-3 right-3 text-stone-500 hover:text-pink-500 transition duration-150 ease-in-out">
            <X size={20} />
        </button>
    )
}