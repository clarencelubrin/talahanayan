export const isDigit = (str: string) => {
    return /^\d+$/.test(str);
}
export const cleanNumber = (str: string) => {
    return str.replace(/[^0-9.]/g, '');
}