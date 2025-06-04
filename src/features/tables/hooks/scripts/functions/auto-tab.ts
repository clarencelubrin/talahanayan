import { headerContentInterface, tableDataInterface } from "shared/interfaces/Data/document-interface";

type AutoTabProps = {
    column: headerContentInterface,
    table: tableDataInterface,
    row_index: number,
    value: string,
    format_index: number
}
export function AutoTab({column, table, row_index, value, format_index}: AutoTabProps) {
    const format = column?.settings.column_formatting[format_index]
    const dependencies = format.settings.dependencies;
    let will_tab = false;
    dependencies?.forEach((dependency) => {
        if (will_tab) {
            return;
        }
        const dependency_column_index = table?.content.headers.findIndex(header => header.value === dependency);
        if (dependency_column_index === -1 || dependency_column_index === undefined ) {
            return;
        }
        const dependency_cell_value = table?.content.rows[row_index][dependency_column_index];
        if (dependency_cell_value.trim() === '' || dependency_cell_value.trim() === undefined) {
            return;
        }
        will_tab = true;
    });

    if (will_tab && !value.includes('\t')) {
        value = '\t' + value;
    } else if (!will_tab && value.includes('\t')) {
        value = value.replace('\t', '');
    }
    return value;
}