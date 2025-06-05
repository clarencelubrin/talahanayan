import { headerContentInterface, tableDataInterface } from "shared/interfaces/Data/document-interface";
type AutoItalicProps = {
    column: headerContentInterface,
    table: tableDataInterface,
    className: string,
    row_index: number,
    format_index: number
}
export function AutoItalic({column, table, className, row_index, format_index}: AutoItalicProps){
    const format = column?.settings.column_formatting[format_index]
    const dependencies = format.settings.dependencies;
    let will_italic = true;
    dependencies?.forEach((dependency) => {
        if (!will_italic) {
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
        will_italic = false;
    });
    if (will_italic && !className.includes('italic')) {
        className = 'italic';
    } else if (!will_italic && className.includes('italic')) {
        className = className.replace('italic', '');
    }
    return className;
}

export function strIsItalic(str: string) {
    return str.startsWith('*') && str.endsWith('*') && str.length > 1;
}
export function removeItalic(str: string)
{
    return str.replace(/\*/g, '');
}
export function addItalic(str: string)
{
    return `*${removeItalic(str)}*`
}