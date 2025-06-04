import { useEffect, useState } from "react";
import { ArrowRightToLine, Italic, Columns3 } from "lucide-react";
import { tableDataInterface, documentInterface } from "src/shared/interfaces/Data/document-interface";
import { produce } from "immer";
import { headerSettingsItemInterface } from "src/shared/interfaces/Data/document-interface";
import { PropertiesHeader, PropertiesInfo, PropertiesUI } from "../../ui/drawer/properties-ui";

export function TextProperties({column_text, table_data, settings, text_setFormatting}: {
    column_text: string | undefined, 
    table_data: tableDataInterface | undefined, 
    settings: headerSettingsItemInterface[], 
    text_setFormatting: React.Dispatch<React.SetStateAction<headerSettingsItemInterface[]>>
}){
    const [auto_tab, setAutoTab] = useState(settings.find(setting => setting.value === 'autotab'));
    const [auto_italicize, setAutoItalicize] = useState(settings.find(setting => setting.value === 'autoitalic'));
    const [auto_tab_dependencies, setAutoTabDependencies] = useState(auto_tab?.settings.dependencies || []);
    const [auto_italicize_dependencies, setAutoItalicizeDependencies] = useState(auto_italicize?.settings.dependencies || []);
    const [hasRepeatedValues, setHasRepeatedValues] = useState(hasArrayRepeatedValues(table_data?.content.headers.map(header => header.value)));
    const filteredHeaders = table_data?.content.headers.filter(item => item.value !== column_text);
    
    const handleOnChangeAutoTab = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        if(checked){
            setAutoTabDependencies([...auto_tab_dependencies, name]);
        } else {
            setAutoTabDependencies(auto_tab_dependencies.filter(dependency => dependency !== name));
        }
    }

    const handleOnChangeAutoItalic = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        if(checked){
            setAutoItalicizeDependencies([...auto_italicize_dependencies, name]);
        } else {
            setAutoItalicizeDependencies(auto_italicize_dependencies.filter(dependency => dependency !== name));
        }
    }
    // Update hasRepeatedValues
    useEffect(() => {
        setHasRepeatedValues(hasArrayRepeatedValues(table_data?.content.headers.map(header => header.value)));
    }, [table_data?.content.headers])

    // Update auto_tab and auto_italicize
    useEffect(() => {
        setAutoTab(settings.find(setting => setting.value === 'autotab'))
        setAutoItalicize(settings.find(setting => setting.value === 'autoitalic'))
    }, [settings])

    // Update auto_tab_dependencies and auto_italicize_dependencies
    useEffect(() => {
        setAutoTabDependencies(auto_tab?.settings.dependencies || [])
        setAutoItalicizeDependencies(auto_italicize?.settings.dependencies || [])
    }, [auto_tab, auto_italicize])

    useEffect(() => {
        if (table_data && (!isEmptyListStr(auto_italicize_dependencies) || !isEmptyListStr(auto_tab_dependencies)))
        text_setFormatting(prev => 
            produce(prev, (draft) => {
                const autoTabDraft = draft.find(setting => setting.value === 'autotab');
                if (autoTabDraft) {
                    autoTabDraft.settings = {dependencies: auto_tab_dependencies};
                }
                const autoItalicSetting = draft.find(setting => setting.value === 'autoitalic');
                if (autoItalicSetting) {
                    autoItalicSetting.settings = {dependencies: auto_italicize_dependencies};
                }
            })
        );
    }, [auto_tab_dependencies, auto_italicize_dependencies])

    return (
        <>
            {auto_tab && 
            <PropertiesUI>
                <PropertiesHeader icon={ArrowRightToLine} property_name="Auto-tab Dependency" settings_name="Auto-tab Properties" />
                {filteredHeaders?.map((headers, index) =>
                    <label key={index} className="flex flex-row items-center gap-2 text-sm font-semibold text-stone-500">
                        <input disabled={hasRepeatedValues} checked={auto_tab_dependencies.includes(headers.value)} onChange={handleOnChangeAutoTab} type="checkbox" name={headers.value} id={index.toString()} className="scale-120"/>
                        {headers.value || 'Untitled'}
                    </label>
                )}
                {hasRepeatedValues && <p className="text-xs text-red-500">Warning: Make sure the column names are unique.</p>}
                <PropertiesInfo>Select the dependencies that <span className="text-stone-500 font-semibold">will trigger the auto-tab</span>. The auto-tab will trigger when the dependencies are filled with data.</PropertiesInfo>
            </PropertiesUI>}    
            {auto_italicize && 
            <PropertiesUI>
                <PropertiesHeader icon={Italic} property_name="Auto-italicize Dependency" settings_name="Auto-italicize Properties" />
                {filteredHeaders?.map((headers, index) =>
                    <label key={index} className="flex flex-row items-center gap-2 text-sm font-semibold text-stone-500">
                        <input disabled={hasRepeatedValues} checked={auto_italicize_dependencies.includes(headers.value)} onChange={handleOnChangeAutoItalic} type="checkbox" name={headers.value} id={index.toString()} className="scale-120"/>
                        {headers.value || 'Untitled'}
                    </label>
                )}
                {hasRepeatedValues && <p className="text-xs text-red-500">Warning: Make sure the column names are unique.</p>}
                <PropertiesInfo>Select the dependencies that <span className="text-stone-500 font-semibold">will turn-off the italization of the column</span> when filled up with data.</PropertiesInfo>
            </PropertiesUI>}   

        </>
    )
}

export function DateProperties({table_data, date_formatting, date_setFormatting}: {
    table_data: tableDataInterface | undefined, 
    date_formatting: headerSettingsItemInterface, 
    date_setFormatting: React.Dispatch<React.SetStateAction<headerSettingsItemInterface>>
}){
    // Changes date locale for Date Inputs
    const [date_input_format, setDateInputFormat] = useState<string[]>(date_formatting.settings['metadata'] || ['auto']);
    // const { updateTable } = useUpdateTable();
    const locale_options = [
        {value: 'auto', label: 'Auto'},
        {value: 'MM-DD-YYYY', label: 'MM-DD-YYYY'},
        {value: 'DD-MM-YYYY', label: 'DD-MM-YYYY'},
        {value: 'YYYY-MM-DD', label: 'YYYY-MM-DD'},
    ]
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setDateInputFormat([value]);
    }
    useEffect(() => {
        if (table_data && !isEmptyStr(date_input_format[0])) {
            date_setFormatting(prev => {
                // Only update if settings actually changed
                if (JSON.stringify(prev.settings['metadata']) !== JSON.stringify(date_input_format)) {
                    return produce(prev, draft => {
                        draft.settings['metadata'] = date_input_format;
                    });
                }
                return prev;
            });
        }
    }, [date_input_format[0], date_setFormatting, table_data]);
    return (
        <PropertiesUI>
            <PropertiesHeader icon={ArrowRightToLine} property_name="Date Input Format" settings_name="Date Input Properties" />
            {locale_options?.map((options, index) =>
                <label key={index} className="flex flex-row items-center gap-2 text-sm font-semibold text-stone-500">
                    <input checked={date_input_format.includes(options.value)} onChange={handleOnChange} type="radio" name='date-options' value={options.value} id={index.toString()} className="scale-120"/>
                        {options.label}
                </label>
            )}
        </PropertiesUI>
    )

}
function hasArrayRepeatedValues(array: string[] | undefined){
    if (!array) return false;
    return new Set(array).size !== array.length;
}

export function BalanceProperties({table_data, calculate, setCalculate}: {
    table_data: tableDataInterface | undefined, 
    calculate: headerSettingsItemInterface, 
    setCalculate: React.Dispatch<React.SetStateAction<headerSettingsItemInterface>>}){
    const [calculation_properties, setCalculationProperties] = useState<headerSettingsItemInterface['settings']>(calculate.settings || {});

    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>, column_type: string) => {
        const { value } = e.target;
        setCalculationProperties(prev => ({ ...prev, [column_type]: [value] }));
    };
    useEffect(() => {
        const debitIdx = table_data?.content.headers.findIndex(header => header.value === 'Debit');
        const creditIdx = table_data?.content.headers.findIndex(header => header.value === 'Credit');
        // Use >= 0 to allow index 0
        if (debitIdx !== undefined && debitIdx >= 0 && creditIdx !== undefined && creditIdx >= 0) {
            setCalculationProperties(prev => ({ 
                ...prev,
                'debit': [debitIdx.toString()],
                'credit': [creditIdx.toString()]
            }));
        }
    }, [])
    useEffect(() => {
        if (table_data && !isEmpty(calculation_properties)) {
            setCalculate(prev => {
                // Only update if settings actually changed
                if (JSON.stringify(prev.settings) !== JSON.stringify(calculation_properties)) {
                    return { value: 'balance', settings: calculation_properties };
                }
                return prev;
            });
        }
    }, [calculation_properties, setCalculate, table_data]);
    return (
        <PropertiesUI>
            <PropertiesHeader icon={Columns3} property_name="Debit column" settings_name="Balance Calculation Dependency" />
            <select name="debit_row" onChange={(e) => handleOnChange(e, 'debit')} value={calculation_properties['debit']} defaultValue="">
                <option disabled value=""> Select an option </option>
                {table_data?.content.headers?.map((header, idx) => {
                    return (<option key={idx} value={idx}>{header.value || 'Untitled'}</option>)
                })}
            </select>
            <PropertiesHeader icon={Columns3} property_name="Credit column" settings_name="" />
            <select name="credit_row" onChange={(e) => handleOnChange(e, 'credit')} value={calculation_properties['credit']} defaultValue="">
                <option disabled value=""> Select an option </option>
                {table_data?.content.headers?.map((header, idx) => {
                    return (<option key={idx} value={idx}>{header.value || 'Untitled'}</option>)
                })}
            </select>
            <PropertiesInfo>Select the dependencies that <span className="text-stone-500 font-semibold">corresponds to the Debit column and Credit column respectively.</span></PropertiesInfo>
        </PropertiesUI>
    )   
}
export function AutoPRProperties({table_data, document, calculate, setCalculate, column_type}: {
    table_data: tableDataInterface | undefined, 
    document: documentInterface | undefined,
    calculate: headerSettingsItemInterface, 
    setCalculate: React.Dispatch<React.SetStateAction<headerSettingsItemInterface>>,
    column_type: string
}){
    const [calculation_properties, setCalculationProperties] = useState<headerSettingsItemInterface['settings']>(calculate.settings || {});

    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>, column_type: string) => {
        const { value } = e.target;
        setCalculationProperties(prev => ({ ...prev, [column_type]: [value] }));
    };
    // useEffect(() => {
    //     const debitIdx = table_data?.content.headers.findIndex(header => header.value === 'Debit');
    //     const creditIdx = table_data?.content.headers.findIndex(header => header.value === 'Credit');
    //     // Use >= 0 to allow index 0
    //     if (debitIdx !== undefined && debitIdx >= 0 && creditIdx !== undefined && creditIdx >= 0) {
    //         setCalculationProperties(prev => ({ 
    //             ...prev,
    //             'debit': [debitIdx.toString()],
    //             'credit': [creditIdx.toString()]
    //         }));
    //     }
    // }, [])
    useEffect(() => {
        if (table_data && !isEmpty(calculation_properties)) {
            setCalculate(prev => {
                // Only update if settings actually changed
                if (JSON.stringify(prev.settings) !== JSON.stringify(calculation_properties)) {
                    return { value: 'auto-pr', settings: calculation_properties };
                }
                return prev;
            });
        }
        console.log(calculation_properties['table-dependency'], 'table-dependency');
    }, [calculation_properties, setCalculate, table_data]);
    return (
        <PropertiesUI>
            <PropertiesHeader icon={Columns3} property_name="Chart of Accounts Dependency" settings_name="Auto-fill P/R" />
            <select name="table_select" onChange={(e) => handleOnChange(e, 'table-dependency')} value={(calculation_properties['table-dependency']?.[0] ?? '')}>
                <option disabled value=""> Select an option </option>
                {document?.sheets && Object.entries(document.sheets).map(([key], idx) => (
                    <option key={idx} value={key}>{key}</option>
                ))}
            </select>
            <PropertiesInfo>Select the dependencies that <span className="text-stone-500 font-semibold">corresponds to the Chart of Accounts.</span></PropertiesInfo>
            <hr className="w-full" />
            <PropertiesHeader icon={Columns3} property_name={`${(column_type === 'number') ? 'Text' : 'P/R'} Column Dependency`} settings_name="" />
            {(column_type === 'text') &&
            <select name="pr_select" onChange={(e) => handleOnChange(e, 'pr')} value={calculation_properties['pr']?.[0] ?? ''}>
                <option disabled value=""> Select an option </option>
                {table_data?.content.headers?.map((header, idx) => {
                    return (<option key={idx} value={idx}>{header.value || 'Untitled'}</option>)
                })}
            </select>}
            {(column_type === 'number') &&
            <select name="pr_select" onChange={(e) => handleOnChange(e, 'text')} value={calculation_properties['text']?.[0] ?? ''}>
                <option disabled value=""> Select an option </option>
                {table_data?.content.headers?.map((header, idx) => {
                    return (<option key={idx} value={idx}>{header.value || 'Untitled'}</option>)
                })}
            </select>}
            <PropertiesInfo>Select the dependencies that <span className="text-stone-500 font-semibold">corresponds to the {(column_type === 'number') ? 'Text' : 'P/R'} column.</span></PropertiesInfo>          
        </PropertiesUI>  
    )   
}
function isEmpty(obj: Object) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
function isEmptyStr(str: String) {
    return str === '' || str === ' '
}
function isEmptyListStr(arr: String[]) {
    return arr.length === 0
}