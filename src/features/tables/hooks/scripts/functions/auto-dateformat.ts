import { headerContentInterface } from "shared/interfaces/Data/document-interface";

type dateObjType = {day: string, month: string, year: string};

export const dateToString = (date: {day?: string, month?: string, year?: string}, userDateFormat: string) => {
    if (!date.day && !date.month && !date.year) return '';
    switch(userDateFormat) {
        case 'MM-DD-YYYY':
            if (date.month && date.day && date.year) return `${date.month}-${date.day}-${date.year}`;
            if (date.month && date.day) return `${date.month}-${date.day}`;
            if (date.month) return `${date.month}`;
            return ``;
        case 'DD-MM-YYYY':
            if (date.day && date.month && date.year) return `${date.day}-${date.month}-${date.year}`;
            if (date.day && date.month) return `${date.day}-${date.month}`;
            if (date.day) return `${date.day}`;
            return ``;
            
        case 'YYYY-MM-DD':
            if (date.year && date.month && date.day) return `${date.year}-${date.month}-${date.day}`;
            if (date.year && date.month) return `${date.year}-${date.month}`;
            if (date.year) return `${date.year}`;
            return ``;
        default:
            return `${date.day}-${date.month}-${date.year}`;
    }
}

export function AutoDateFormat({column, date_obj, userLocaleDateFormat}: {column: headerContentInterface, date_obj: dateObjType, userLocaleDateFormat: string}) {
    const formats = column?.settings.column_formatting.filter(format => format.value !== 'metadata');
    let value = '';
    // For Date formatting
    formats.forEach((format) => {
        date_obj = NormalizeDate(date_obj);
        // For formatting
        const date_value = new Date(parseInt(date_obj.year), parseInt(date_obj.month) - 1, parseInt(date_obj.day));
        const day = date_value.getDate();
        const year = date_value.getFullYear();
        if (format.value === 'datenone') {
            value= dateToString(date_obj, userLocaleDateFormat);
        }
        if (format.value === 'datelong') {
            const month_long = date_value.toLocaleString('default', { month: 'long' });
            value= `${month_long} ${day}, ${year}`;
        }
        if (format.value === 'dateshort') {
            const month_short = date_value.toLocaleString('default', { month: 'short' });
            value = `${month_short}. ${day}, ${year}`;
        }
        if (format.value === 'datelong-noyear'){
            const month_long = date_value.toLocaleString('default', { month: 'long' });
            value= `${month_long} ${day}`;
        }
        if (format.value === 'dateshort-noyear') {
            const month_short = date_value.toLocaleString('default', { month: 'short' });
            value = `${month_short}. ${day}`;
        }
        if (format.value === 'datelong-month') {
            const month_long = date_value.toLocaleString('default', { month: 'long' });
            value = `${month_long}`;
        }
        if (format.value === 'dateshort-month') {
            const month_short = date_value.toLocaleString('default', { month: 'short' });
            value = `${month_short}.`;
        }
    });
    return value;
}

function NormalizeDate(date: dateObjType): dateObjType {
    // Fill in missing values
    if(!date.day) date.day = '01';
    if(!date.month) date.month = '01';
    if(!date.year) date.year = '1900';
    

    if (parseInt(date.day) < 1) {
        date.day = '01';
    } else if (parseInt(date.day) > 31) { 
        date.day = '31';
    }
    if (parseInt(date.month) < 1) {
        date.month = '01';
    } else if (parseInt(date.month) > 12) {
        date.month = '12';
    }
    if (parseInt(date.year) < 1900) {
        date.year = '1900';
    }
    if (parseInt(date.year) > 2100) {
        date.year = '2100';
    }
    return {day: date.day, month: date.month, year: date.year};
}