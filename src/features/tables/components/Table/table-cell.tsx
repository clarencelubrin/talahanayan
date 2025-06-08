import { useState, useRef, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { DataHeaderCellProps, DataTableCellProps } from 'src/features/tables/types/Table/table-cell-interface';
import { TemplateIcons } from 'src/features/tables/ui/Icons/template-icons';

import { HeaderCell, Cell } from 'src/features/tables/ui/Table/table-ui';
import Resizer from '../Resizer/table-col-resizer';
import { TableHeaderDropdown } from '../Dropdown/table-header-dropdown';
import { TableInfoContext } from './table';
import { useClickDropdown } from '../../hooks/dropdown/use-clickDropdown';

import { InputText } from 'src/features/tables/components/Inputs/input-text';
import { InputDate } from 'src/features/tables/components/Inputs/input-date';
import { InputNumber } from '../Inputs/input-num';
import { InputMoney } from '../Inputs/input-money';

function DataHeaderCell({column_index, header, settings, widths_list, setWidthList, handleOnMouseUpResizer}: DataHeaderCellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(header);

    const ref = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const resizerRef = useRef<HTMLDivElement>(null);
    const position = useRef<DOMRect | undefined>(undefined);

    useEffect(() => {
        setValue(header);
    }, [header]);

    useClickDropdown({
        ref,
        dropdownRef,
        resizerRef,
        isOpen,
        setIsOpen,
        position
    });
    
    return (
    <div 
        className='relative flex flex-row hover:bg-stone-100 hover:cursor-pointer active:bg-stone-200 
            transition duration-100 ease-in-out resizable select-none' 
        style={{width: widths_list[column_index]}} 
        ref={ref} 
    >
        <div className='flex flex-row items-center justify-center shrink-0 aspect-square h-full'>
            <TemplateIcons cell_name={header.toLocaleLowerCase()} className="shrink-0" />
        </div>
        <HeaderCell className='py-1.5 w-full truncate'>
            {value}
        </HeaderCell>
        {
            createPortal(        
            <TableHeaderDropdown 
                column={{value: header, settings}}
                position={position}
                isOpen={isOpen} 
                value={value} 
                dropdownRef={dropdownRef}
                column_index={column_index}
            />, document.getElementById('root') as HTMLElement)
        }

        <Resizer setSheetWidths={setWidthList} thIndex={column_index} resizerRef={resizerRef} handleOnMouseUp={handleOnMouseUpResizer}/>
    </div>
    );
}
    
function DataTableCell({ cell_index, row_index, cell_data, style }: DataTableCellProps) {
    const { table_data } = useContext(TableInfoContext);
    const [input_type, setInputType] = useState(table_data?.content.headers[cell_index]?.settings.column_type);

    useEffect(() => {
        setInputType(table_data?.content.headers[cell_index]?.settings.column_type);
    }, [table_data?.content.headers, cell_index]);

    return (
        <Cell style={style}>
            {(input_type === 'text') && <InputText cell_index={cell_index} row_index={row_index} cell_data={cell_data} />}
            {(input_type === 'date') && <InputDate cell_index={cell_index} row_index={row_index} cell_data={cell_data} />}
            {(input_type === 'number') && <InputNumber cell_index={cell_index} row_index={row_index} cell_data={cell_data} />}
            {(input_type === 'money') && <InputMoney cell_index={cell_index} row_index={row_index} cell_data={cell_data} />}
        </Cell>
    )
}

function HoverOptionCell({ children }: {children: React.ReactNode}) {
    return (
        <div className='absolute inset-0 -left-16 w-12 flex flex-row items-center justify-center mx-3'>
            {children}
        </div>
    )
}




export { DataHeaderCell, DataTableCell, HoverOptionCell }