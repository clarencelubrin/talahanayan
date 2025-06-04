import { useState } from "react";
import { headerContentInterface } from "shared/interfaces/Data/document-interface";
import { produce } from "immer";
import { tableDataInterface } from "shared/interfaces/Data/document-interface";
import { useOnClick } from 'src/features/tables/hooks/capture/use-onclick';

export type columnLocationType = {document_id: string, sheet_name: string, table_index: number, column_index: number}
export type useDrawerType = {
    is_visible: boolean, 
    column: headerContentInterface
    column_location: columnLocationType
    table_data: tableDataInterface
}
export function useDrawer(){
    const [drawer, setDrawer] = useState<useDrawerType | undefined>(undefined);

    useOnClick((event: MouseEvent) => {
        const drawerElement = document.getElementById('drawer');
        const button = document.getElementById('table-header-dropdown-edit');
        if (drawerElement && !drawerElement.contains((event.target as Node)) && button && !button.contains((event.target as Node))) {
            console.log('Clicked outside drawer');
            closeDrawer();
        }
    });

    const openDrawer = ({is_visible, column, column_location, table_data}: useDrawerType) => {
        setDrawer({is_visible, column, column_location, table_data});
    }
    const closeDrawer = () => {
        /*
            This hides the current drawer,
            but does not remove the drawer from the state.
        */
        setDrawer(prev => produce(prev, draft => {
            if (draft) {
                draft.is_visible = false;
            }
        }));
        setTimeout(() => {
            setDrawer(undefined);
        }, 300);
    }
    return { drawer, openDrawer, closeDrawer }
}