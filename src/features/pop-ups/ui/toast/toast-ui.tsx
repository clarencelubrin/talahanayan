import { motion, AnimatePresence } from "framer-motion";
import { ToastUIProps } from "../../types/toast/toast-types";
export function ToastUI({
    children,
    type,
    is_visible,
    onClick
}: ToastUIProps){
    return (
        <AnimatePresence initial={false} mode="wait" onExitComplete={()=>null}>
            {is_visible &&
            <motion.div 
                key={type}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className={`${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-gray-500'} select-none rounded-md w-80 border border-stone-200`}
                onClick={onClick}
            >   
            <div className="bg-white ms-2 p-3">
                {children}
            </div>
            </motion.div>}
        </AnimatePresence>
    )
}