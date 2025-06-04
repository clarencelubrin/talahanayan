export type documentListInterface = documentInterface[];

export interface documentInterface {
    id: string;
    name: string;
    sheets: {[key: string]: sheetDataInterface};
}
export const DocumentDefault = {
    id: "",
    name: "",
    sheets: {}
}
export interface sheetDataInterface {
    type: string;
    tables: tableDataInterface[];
}

export interface tableDataInterface {
    type: TableTypesInterface;
    headers: {
        title: string;
        number: string;
    },
    column_widths: number[];
    content: tableContentInterface
}

export type TableTypesInterface = "untitled-table" | "titled-table" | "accounts-table";

export interface tableContentInterface {
    headers: headerContentInterface[];
    rows: string[][];
}

export interface headerContentInterface {
    value: string;
    settings: headerSettingsInterface
}

export interface headerSettingsInterface {
    column_type: string;
    column_formatting: headerSettingsItemInterface[];
    column_calculation: headerSettingsItemInterface[];
}
export interface headerSettingsItemInterface {
    value: string
    settings: {[key: string]: string[]}
}

// settings: {column: ['1', '2', '3'], exclusion: ['and']}

export const TableDataDefault: tableDataInterface = {
    type: "untitled-table",
    headers: {
        title: "",
        number: ""
    },
    column_widths: [150, 150, 150],
    content: {
        headers: [
            {value: "Untitled", settings: {column_type: "text", column_formatting: [], column_calculation: []}},
            {value: "Untitled", settings: {column_type: "text", column_formatting: [], column_calculation: []}},
            {value: "Untitled", settings: {column_type: "text", column_formatting: [], column_calculation: []}},
        ],
        rows: [["", "", ""]]
    }
}

export const SheetDataDefault: sheetDataInterface = {
    type: "",
    tables: [TableDataDefault]
}