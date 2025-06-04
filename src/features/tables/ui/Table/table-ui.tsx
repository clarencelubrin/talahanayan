import { motion } from 'framer-motion';
import { childrenType, headerRowType, rowType, headerCellType, cellType, tableDataInterface } from "src/features/tables/types/Table-UI/table-ui-interface"
import { forwardRef } from 'react';

const Table = forwardRef<HTMLDivElement, tableDataInterface>(({ children }, ref) => {
    const animation = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.1, ease: "easeInOut" } },
        exit: { opacity: 0, transition: { duration: 0.1, ease: "easeInOut" } }
    }
    return (
        <motion.div className="table" ref={ref} 
            variants={animation}
            initial='hidden'
            animate='visible'
            exit='exit'
        >
            {children}
        </motion.div>
    );
});
function TableHead({children}: childrenType) {
  return (
    <div className='table-header'>
        {children}
    </div>
  )
}
function TableBody({children}: childrenType) {
    return (
        <div className='table-body'>
            {children}
        </div>
    )
}
function HeaderRow({children, className='', onMouseEnter, onMouseLeave}: headerRowType) {
    return (
        <div className={`table-rows flex flex-row w-full ${className}`}
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave}>
            {children}
        </div>
    )
}
const Row = forwardRef<HTMLDivElement, rowType>(({ className = '', onMouseEnter, onMouseLeave, children }, ref) => {
    return (
        <div className={`table-rows flex flex-row w-full ${className}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            ref={ref}
        >
            {children}
        </div>
    );
});
function HeaderCell({className='', style, children}: headerCellType) {
    return (
        <div className={`table-header-cell ${className}`} style={style}>
            {children}
        </div>
    )
}
const Cell = forwardRef<HTMLDivElement, cellType>(({className='', children, style}, ref) => {
    return (
        <div className={`table-cell ${className}`} style={style} ref={ref}>
            {children}
        </div>
    )
});
function AddRow({className='', children}: cellType) {
    return (
        <div className={`table-add-row ${className}`}>
            {children}
        </div>
    )
}
export { Table, TableHead, TableBody, HeaderRow, Row, HeaderCell, Cell, AddRow  }
