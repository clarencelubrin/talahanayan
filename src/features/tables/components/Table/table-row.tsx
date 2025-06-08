import { useContext, useEffect, useState, useRef } from 'react';
import { produce } from 'immer';
import { Plus } from 'lucide-react' 
import { DataTableCell, DataHeaderCell } from 'src/features/tables/components/Table/table-cell'
import { HoverOptions, HeaderHoverOptions } from '../Hover/HoverOptions';
import { Row, HeaderRow } from 'src/features/tables/ui/Table/table-ui'
import { DataRowProps, DataHeaderRowProps } from 'src/features/tables/types/Table/table-row-interface';
import { useDataStore } from 'src/store';
import { TableInfoContext } from './table';
import { HoverOptionCell } from './table-cell';

export function DataRow({
    row, 
    row_index, 
    is_hovered_list, 
    width_list,
    checked_list,
    setCheckedList,
    setIsHoveredList, 
    is_checked_all,
    content
}: DataRowProps) {
    const index = useRef(row_index); 
    useEffect(() => {
        // Update row index when row_index changes
        index.current = row_index;
    }, [row_index])
    
    const handleOnHover = (row_index: number) => {
        const false_list = new Array(content.rows.length).fill(false);
        setIsHoveredList(produce(false_list, draft => {
            draft[row_index] = true;
        }))
    }
    const handleOffHover = (row_index: number) => {
        setIsHoveredList(produce(is_hovered_list, draft => {
            draft[row_index] = false;
        }))
    }
    return(
        <Row key={row_index} className='relative'
            onMouseEnter={() => handleOnHover(row_index)}
            onMouseLeave={() => handleOffHover(row_index)}>
            <HoverOptionCell>
                <HoverOptions checked_list={checked_list} is_hovered={is_hovered_list[row_index]} is_checked_all={is_checked_all} setCheckedList={setCheckedList} row_index={index}/>
            </HoverOptionCell>
            {row.map((cell, cell_index) => (
                <DataTableCell key={cell_index} row_index={row_index} cell_index={cell_index} 
                    cell_data={cell} style={{width: width_list[cell_index]}}/>    
            ))}
        </Row>
    )
}

export function DataHeaderRow({
    content,
    width_list,
    checked_list,
    setWidthList,
    setCheckAll
}: DataHeaderRowProps){

    const addColumn = useDataStore(state => state.addColumn);
    const setColumnWidths = useDataStore(state => state.setColumnWidths);
    const { document_id, sheet_name, table_index } = useContext(TableInfoContext);
    const [is_hovered, setIsHovered] = useState(false);
    const showHoverOptions = is_hovered || checked_list.length > 0;

    const handleOnMouseUpResizer = () => {
        // Update column widths in zustand store when resizer is released
        setColumnWidths(document_id, sheet_name, table_index, width_list);
    }
    // useEffect(() => {
    //     console.log('TRIGGERED');
    //     setIsHovered(false);
    // }, [content.rows.length]);

    // useEffect(() => {
    //     // If any row is checked, show hover options
    //     if(checked_list.length > 0) {
    //         setIsHovered(true);
    //     } else {
    //         setIsHovered(false);
    //     }
    //     return () => {
    //         // Cleanup function to reset hover state
    //         setIsHovered(false);
    //     }
    // }, [checked_list])

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative"
            >
        <HeaderRow className='relative'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>

            <HoverOptionCell>
                <HeaderHoverOptions is_hovered={showHoverOptions} setCheckAll={setCheckAll} checked_list={checked_list} row_length={content.rows.length}/>
            </HoverOptionCell>

            {content.headers.map((header, index) => (
                <DataHeaderCell key={index} column_index={index} header={header.value} settings={header.settings} widths_list={width_list} 
                    setWidthList={setWidthList} handleOnMouseUpResizer={handleOnMouseUpResizer} />
            ))}

            <div className='flex flex-row items-center'>
                <button className='flex justify-center items-center h-full aspect-square hover:bg-stone-100' 
                    onClick={() => {
                        setIsHovered(false);
                        addColumn(document_id, sheet_name, table_index, new Array(content.rows.length).fill(''))
                    }}>
                    <Plus size={16} strokeWidth={2} color='#9ca3af' />
                </button>
            </div>
        </HeaderRow>
        </div>
    )
}

