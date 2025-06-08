import { AnimatePresence, motion } from 'framer-motion';
import React, { forwardRef, useMemo } from 'react';
const animation = {
    hidden: { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.12, ease: 'easeOut' } },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.16, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.1, ease: 'easeIn' } }
};

export const Dropdown = forwardRef<HTMLDivElement, {isOpen: boolean, children: React.ReactNode, className?: string, align?: 'left' | 'right'}>(({isOpen, children, className, align='left'}, ref) => {

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

    const computedStyle = useMemo(() => {
        const pos = position.current;
        return {
            position: 'absolute',
            top: `${(pos?.bottom ?? 0) + window.scrollY}px`,
            left: align === 'left' ? `${(pos?.left ?? 0) - window.scrollX}px` : 'auto',
            right: align === 'right' ? `${window.innerWidth - (pos?.right ?? 0) - window.scrollX}px` : 'auto'
        };
    }, [position.current, align]);

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
            style={computedStyle as React.CSSProperties}
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
