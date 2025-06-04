import { create } from 'zustand';
import { diff } from 'deep-object-diff';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { produce } from 'immer';
import { temporal, TemporalState } from 'zundo';
import { 
    documentInterface, 
    documentListInterface, 
    tableDataInterface, 
    sheetDataInterface,
} from './shared/interfaces/Data/document-interface';

type DataStore = {
    data?: documentListInterface;

    // Get from API and set data
    initDataAsync: (documents: documentListInterface) => Promise<void>;

    // Set function
    setData: (data: documentListInterface) => void; 
    setDocument: (document_id: string, document: documentInterface) => void;
    setSheet: (document_id: string, sheet_name: string, sheet: sheetDataInterface) => void;
    setTable: (document_id: string, sheet_name: string, table_index: number, table: tableDataInterface) => void;
    setColumnWidths: (document_id: string, sheet_name: string, table_index: number, column_widths: number[]) => void;
    // Get function
    getData: () => documentListInterface | undefined;
    getDocument: (document_id: string) => documentInterface | undefined;
    getSheet: (document_id: string, sheet_name: string) => sheetDataInterface | undefined;
    getTable: (document_id: string, sheet_name: string, table_index: number) => tableDataInterface | undefined;

    // Add functions
    addRow: (document_id: string, sheet_name: string, table_index: number, row: string[]) => void;
    addRowatIndex: (document_id: string, sheet_name: string, table_index: number, row: string[], index: number) => void;
    addColumn: (document_id: string, sheet_name: string, table_index: number, column: string[]) => void;
    addTable: (document_id: string, sheet_name: string, table: tableDataInterface) => void;
    addSheet: (document_id: string, sheet_name: string, sheet: sheetDataInterface) => void;
    // Remove functions
    removeRow: (document_id: string, sheet_name: string, table_index: number, row_index: number) => void;
    removeMultipleRows: (document_id: string, sheet_name: string, table_index: number, row_indices: number[]) => void;
    removeColumn: (document_id: string, sheet_name: string, table_index: number, column_index: number) => void;
    removeTable: (document_id: string, sheet_name: string, table_index: number) => void;
};

export const useDataStore = create(
    temporal<DataStore>((set, get) => 
    ({
        data: undefined,
        // Initialize data from API
        initDataAsync: async (documents) => {
            set({ data: documents });
        },

        // Set data
        setData: (data) => set({ data }),

        // Get functions
        getData: () => {
            return get().data;
        },
        getDocument: (document_id) => { 
            return get().data?.find((doc) => doc.id === document_id);
        },
        getSheet: (document_id, sheet_name) => {
            const document = get().data?.find((doc) => doc.id === document_id);
            return document?.sheets[sheet_name];
        },
        getTable: (document_id, sheet_name, table_index) => {
            const document = get().data?.find((doc) => doc.id === document_id);
            const sheet = document?.sheets[sheet_name];
            return sheet?.tables[table_index];
        },

        // Set functions
        setDocument: (document_id, document) => {
            set((state) => produce (state, (draft) => {
                const doc = draft.data?.find(doc => doc.id === document_id);
                if (doc) {
                    Object.assign(doc, document);
                }
            }));
        },
        setSheet: (document_id, sheet_name, sheet) => {
            set((state) => produce(state, (draft) => {
                const doc = draft.data?.find(doc => doc.id === document_id);
                if (doc) {
                    doc.sheets[sheet_name] = sheet;
                }
            }));
        },

        setTable: (document_id, sheet_name, table_index, table) => {
            set((state) => produce(state, (draft) => {
            const tables = draft.data?.find(doc => doc.id === document_id)?.sheets[sheet_name].tables;
                if (tables) {
                    tables[table_index] = table;
                }
            }
        ))},
        setColumnWidths: (document_id, sheet_name, table_index, column_widths) => {
            if (column_widths.length === 0) return
            if (document_id === "" || sheet_name === "" || table_index === -1) return
            set((state) => produce(state, (draft) => {
                const table = draft.data?.find(doc => doc.id === document_id)?.sheets[sheet_name].tables[table_index];
                if (table) {
                    table.column_widths = column_widths;
                }
            }));    
        },
        // Add functions
        addRow: (document_id, sheet_name, table_index, row) => {
            if (document_id === "" || sheet_name === "" || table_index === -1) return

            set((state) => produce(state, (draft) => {
                const table = draft.data?.find(doc => doc.id === document_id)?.sheets[sheet_name].tables[table_index];
                if (table) {
                    table.content.rows.push(row);
                }
            }));
        },
        addRowatIndex: (document_id, sheet_name, table_index, row, index) => {
            if (document_id === "" || sheet_name === "" || table_index === -1) return

            set((state) => produce(state, (draft) => {
                const table = draft.data?.find(doc => doc.id === document_id)?.sheets[sheet_name].tables[table_index];
                if (table) {
                    table.content.rows.splice(index + 1, 0, row);
                }
            }));
        },
        addColumn: (document_id, sheet_name, table_index, column) => {
            if (document_id === "" || sheet_name === "" || table_index === -1) return

            set((state) => produce(state, (draft) => {
                const table = draft.data?.find(doc => doc.id === document_id)?.sheets[sheet_name].tables[table_index];
                if (table) {
                    table.column_widths.push(150); // Add default width
                    table.content.headers.push({value: "Untitled", settings: {column_type: "text", column_formatting: [], column_calculation: [{value: "", settings: {}}]}});
                    table.content.rows.forEach((row, index) => row.push(column[index]));
                }
            }));
        },
        addTable: (document_id, sheet_name, table) => {
            if (document_id === "" || sheet_name === "") return

            set((state) => produce(state, (draft) => {
                const sheet = draft.data?.find(doc => doc.id === document_id)?.sheets[sheet_name];
                if (sheet){
                    sheet.tables.push(table);
                }
            }))
        },
        addSheet: (document_id, sheet_name, sheet) => {
            if (document_id === "" || sheet_name === "") return

            set((state) => produce(state, (draft) => {
                const doc = draft.data?.find(doc => doc.id === document_id);
                if (doc) {
                    doc.sheets[sheet_name] = sheet;
                }
            }));
        },
        // Remove functions
        removeRow: (document_id, sheet_name, table_index, row_index) => {
            set((state) => produce(state, (draft) => {
                const table = draft.data?.find(doc => doc.id === document_id)?.sheets[sheet_name].tables[table_index];
                if (table) {
                    table.content.rows.splice(row_index, 1);
                }
            }));
        },
        removeMultipleRows: (document_id, sheet_name, table_index, row_indices) => {
            set((state: DataStore) => produce(state, (draft: DataStore) => {
                const table = draft.data?.find(doc => doc.id === document_id)?.sheets[sheet_name].tables[table_index];
                if (table) {
                    table.content.rows = table.content.rows.filter((_, index: number) => !row_indices.includes(index));
                }
            }));
        },
        removeColumn: (document_id, sheet_name, table_index, column_index) => {
            set((state) => produce(state, (draft) => {
                const table = draft.data?.find(doc => doc.id === document_id)?.sheets[sheet_name].tables[table_index];
                if (table) {
                    table.content.headers.splice(column_index, 1);
                    table.content.rows.forEach((row) => row.splice(column_index, 1));
                    table.column_widths.splice(column_index, 1); // Remove width
                }
            }));
        },
        removeTable: (document_id, sheet_name, table_index) => {
            set((state) => produce(state, (draft) => {
                const sheet = draft.data?.find(doc => doc.id === document_id)?.sheets[sheet_name];
                if (sheet) {
                    sheet.tables.splice(table_index, 1);
                }
            }));
        }
    }),
    {
        equality: (pastState, currentState) =>
            isSameActions(pastState, currentState) || 
            pastState.data === undefined || 
            ignoreKeys(pastState.data, currentState.data, ['type']),
    },
));

export const useTemporalStore = <T extends unknown>(
    selector: (state: TemporalState<DataStore>) => T,
    equality?: (a: T, b: T) => boolean,
) => useStoreWithEqualityFn(useDataStore.temporal, selector, equality);

// Helper function to check if the actions are the same
let tempDifference = {};
function isSameActions(pastState: any, currentState: any){
    const difference = diff(pastState, currentState);
    const isSame = haveSameKeys(difference, tempDifference);
    console.log("isSameActions", isSame, difference, tempDifference);
    tempDifference = difference;
    
    return isSame;
}

export function resetTempDifference(){
    tempDifference = {};
}

function haveSameKeys(obj1: any, obj2: any) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key)) {
            return false;
        }

        if (typeof obj1[key] === 'object' && obj1[key] !== null && typeof obj2[key] === 'object' && obj2[key] !== null) {
            if (!haveSameKeys(obj1[key], obj2[key])) {
                return false;
            }
        }
    }

    return true;
}

// Helper function that ignores the change if the changed value is in a list of ignored keys
export function ignoreKeys(past_state: any, current_state: any, keys: string[]) {
    const difference: any = diff(past_state, current_state);
    const key = getInnermostKeys(difference);
    let isIgnored = false;
    keys.forEach((ignored_key) => {
        if (ignored_key === key) {
            isIgnored = true;
        }
    });
    return isIgnored;
}

// Helper function to get the innermost keys of a nested object
function getInnermostKeys(obj: any) {
    let innermostKeys = "";

    function traverse(currentObj: any) {
        for (let key in currentObj) {
            if (typeof currentObj === 'object' && currentObj !== null) {
                if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
                    traverse(currentObj[key]);
                } else {
                    innermostKeys = key;
                }
            }
        }
    }
    traverse(obj);
    return innermostKeys;
}
