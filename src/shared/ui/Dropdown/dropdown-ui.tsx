import { AnimatePresence, motion } from 'framer-motion';
import React, { forwardRef } from 'react';

export const Dropdown = forwardRef<HTMLDivElement, {isOpen: boolean, children: React.ReactNode, className?: string, align?: 'left' | 'right'}>(({isOpen, children, className, align='left'}, ref) => {
    const animation = {
        hidden: { opacity: 0, y: -10, scale: 0.75, transition: { type: 'spring', stiffness: 300, damping: 20 } },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20, duration: 0.1 } },
        exit: { opacity: 0, y: -10, scale: 0.75, transition: { type: 'spring', stiffness: 300, damping: 20, duration: 0.1 } }
    }
    return (
        <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={()=>null}
        >
        {isOpen &&
        <motion.div 
                ref={ref || undefined}
                className={`absolute top-8 ${align}-0 z-10 ${className}`}
                id='dropdown'
                variants={animation}
                initial="hidden"
                animate={isOpen ? 'visible' : 'hidden'}
                exit='exit'
            >
            {children}
        </motion.div>}
        </AnimatePresence>
    )
});

type TableDropdownProps = {
    isOpen: boolean, 
    children?: React.ReactNode, 
    className?: string, 
    position: React.MutableRefObject<DOMRect | undefined>
    align?: 'left' | 'right'
};
export const TableDropdown = forwardRef<HTMLDivElement, TableDropdownProps>(({isOpen, children, className, position, align='left'}, ref) => {
    
    const animation = {
        hidden: { opacity: 0, y: -10, scale: 0.75, transition: { type: 'spring', stiffness: 300, damping: 20 } },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20, duration: 0.1 } },
        exit: { opacity: 0, y: -10, scale: 0.75, transition: { type: 'spring', stiffness: 300, damping: 20, duration: 0.1 } }
    }

    return (
        <AnimatePresence
            initial={false}
            mode="wait"
            onExitComplete={()=>null}
        >
        {isOpen &&
        <motion.div 
            ref={ref || undefined}
            id='dropdown'
            className={`${className} z-10`} 
            style={{ 
            position: 'absolute', 
            top: `${(position.current?.bottom ?? 0) + (window.scrollY)}px`, 
            left: `${align === 'left' ? (position.current?.left ?? 0) - (window.scrollX) : 'auto'}px`,
            right: `${align === 'right' ? (window.innerWidth - (position.current?.right ?? 0)) - (window.scrollX) : 'auto'}px`
            }}
            variants={animation}
            initial="hidden"
            animate={isOpen ? 'visible' : 'hidden'}
            exit='exit'
        >
            {children}
        </motion.div>}
        </AnimatePresence>
    )
});
