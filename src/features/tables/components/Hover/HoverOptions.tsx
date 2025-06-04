import { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { produce } from 'immer';
import { IconButton } from 'src/features/document/ui/Buttons/icon-button';
import { TableFunctionContext } from '../Table/table';
import 'src/App.css';

type HoverOptionsProps = {
    is_hovered: boolean
    is_checked_all: boolean
    row_index: React.MutableRefObject<number>
    checked_list: React.MutableRefObject<number>[]
    setCheckedList: React.Dispatch<React.SetStateAction<React.MutableRefObject<number>[]>>
}
const hoverAnimation = {
    hidden: { 
        opacity: 0, 
        transition: {
            duration: 0.2,
            type: 'tween'
        }
    },
    visible: { 
        opacity: 1, 
        transition: {
            duration: 0.2,
            type: 'tween'
        }
    },
    exit: { 
        opacity: 0, 
        transition: {
            duration: 0.2,
            type: 'tween'
        }
    }
};

export function HoverOptions({ is_hovered, is_checked_all, row_index, checked_list, setCheckedList }: HoverOptionsProps) {
    const [check_value, setCheckValue] = useState(is_checked_all);
    const { handleAddRowatIndex } = useContext(TableFunctionContext)
    useEffect(() => {
        setCheckValue(is_checked_all);
    }, [is_checked_all]);

    useEffect(() => {
        // Update checked list in table state 
        if(check_value){
            setCheckedList(produce(checked_list => {
                checked_list.push(row_index);
            }));
        }
        else{
            setCheckedList(produce(checked_list => {
                checked_list.splice(checked_list.findIndex((value) => value.current === row_index.current), 1);
            }));
        }
    }, [check_value]);

    useEffect(() => {
        // Set to false when checked list is empty
        if (checked_list.length === 0) {
            setCheckValue(false);
        }
    }, [checked_list]);
    
    return (
        <AnimatePresence
        initial={false}
        mode='wait'
        onExitComplete={()=>null}>
        <motion.div 
            className={`rounded-lg scale-200`}
            variants={hoverAnimation}
            initial="hidden"
            animate={(is_hovered || check_value) ? 'visible' : 'hidden'}
            exit='exit'
        >
            <div className="flex flex-row gap-2 items-center">
                <IconButton icon={Plus} onClick={()=>handleAddRowatIndex(row_index.current)} />
                <input type="checkbox" className="checkbox-primary scale-110" onChange={() => setCheckValue(!check_value)} checked={check_value}/>
            </div>
        </motion.div>
        </AnimatePresence>
    );
}
type HeaderHoverOptionsProps = {
    is_hovered: boolean
    checked_list: React.MutableRefObject<number>[];
    setCheckAll: React.Dispatch<React.SetStateAction<boolean>>
    row_length: number
}
export function HeaderHoverOptions({ is_hovered, checked_list, setCheckAll, row_length }: HeaderHoverOptionsProps) {
    const [check_value, setCheckValue] = useState(false);

    const handleOnCheck = () => {
        setCheckValue(!check_value);
        setCheckAll(!check_value);
    }
    
    useEffect(() => {
        if(checked_list.length >= row_length) {
            setCheckValue(true);
            setCheckAll(true);
        } else {
            setCheckValue(false);
        }
        if (checked_list.length === 0) {
            setCheckAll(false);
        }
    }, [checked_list]);

    return (
        <AnimatePresence
        initial={false}
        mode='wait'
        onExitComplete={()=>null}>
        <motion.div 
            className={`rounded-lg scale-200`}
            variants={hoverAnimation}
            initial="hidden"
            animate={(is_hovered || check_value) ? 'visible' : 'hidden'}
            exit='exit'
        >
            <div className="flex flex-row gap-2 items-center">
                <div className='w-[18px]'></div>
                <input type="checkbox" className="checkbox-primary scale-110" onChange={() => handleOnCheck()} checked={check_value}/>
            </div>
        </motion.div>
        </AnimatePresence>
    );
}