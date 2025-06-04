import { Text, Hash, Calendar, PiggyBank, ArrowRightToLine, 
         Italic, Ban, Coins, PhilippinePeso, ChevronRight, Dot, 
         CaseUpper, CaseLower, CaseSensitive } from "lucide-react";
import { ToggleContainer, ToggleSelection } from "../../ui/drawer/toggle-ui";
import { BoxSelection, SelectionContainer } from "../../ui/drawer/selection-ui";
import { BoxSelectionString, SelectionContainerString } from "../../ui/drawer/selection-str-ui";
import { headerSettingsItemInterface } from "src/shared/interfaces/Data/document-interface";

function ColumnTypeOptions({column_type, setColumnType}: {column_type: string, setColumnType: React.Dispatch<React.SetStateAction<string>>}) {
    return(
        <>
            <p className="mt-2 text-sm font-semibold text-stone-700">Column Type</p>
            <SelectionContainerString selected={column_type} setSelected={setColumnType}>
                <BoxSelectionString value='text'><Text size={16} />Text</BoxSelectionString>
                <BoxSelectionString value='date'><Calendar size={16}/>Date</BoxSelectionString>
                <BoxSelectionString value='money'><Coins size={16}/>Money</BoxSelectionString>
                <BoxSelectionString value='number'><Hash size={16}/>Number</BoxSelectionString>
            </SelectionContainerString>
        </>
    )
}

function TextOptions({text_formatting, text_setFormatting}: {text_formatting: headerSettingsItemInterface[], text_setFormatting: React.Dispatch<React.SetStateAction<headerSettingsItemInterface[]>>}) {
    return(
        <>
            <p className="mt-2 text-sm font-semibold text-stone-700">Formatting</p>
            <ToggleContainer toggled_options={text_formatting} setToggleOptions={text_setFormatting}>
                <ToggleSelection value="autotab"><ArrowRightToLine size={16}/>Auto-tab</ToggleSelection>
                <ToggleSelection value="autoitalic"><Italic size={16}/>Auto-italicize</ToggleSelection>
                <ToggleSelection disabled={arrayIncludeSome(text_formatting.map(format => format.value), ['lowercase', 'capitalize'])} value="uppercase"><CaseUpper size={16}/>Uppercase</ToggleSelection>
                <ToggleSelection disabled={arrayIncludeSome(text_formatting.map(format => format.value), ['uppercase', 'capitalize'])} value="lowercase"><CaseLower size={16}/>Lowercase</ToggleSelection>
                <ToggleSelection disabled={arrayIncludeSome(text_formatting.map(format => format.value), ['uppercase', 'lowercase'])} value="capitalize"><CaseSensitive size={16}/>Capitalize</ToggleSelection>
            </ToggleContainer>                
        </>
    )
}

function arrayIncludeSome(array: string[], some: string[]) {
    return some.some(item => array.includes(item))
}

function NumberOptions({ num_formatting, num_setFormatting }: {num_formatting: headerSettingsItemInterface[], num_setFormatting: React.Dispatch<React.SetStateAction<headerSettingsItemInterface[]>>}) {
    return(
        <>
            <p className="mt-2 text-sm font-semibold text-stone-700">Formatting</p>
            <ToggleContainer toggled_options={num_formatting} setToggleOptions={num_setFormatting}>
                <ToggleSelection value="comma"><ChevronRight size={16}/>Comma</ToggleSelection>
                <ToggleSelection value="decimal"><Dot size={16}/>Decimal</ToggleSelection>
            </ToggleContainer>                
        </>
    )
}

function MoneyOptions({money_formatting, money_setFormatting}: {money_formatting: headerSettingsItemInterface[], money_setFormatting: React.Dispatch<React.SetStateAction<headerSettingsItemInterface[]>>}) {
    return(
        <>
            <p className="mt-2 text-sm font-semibold text-stone-700">Formatting</p>
            <ToggleContainer toggled_options={money_formatting} setToggleOptions={money_setFormatting}>
                <ToggleSelection value="comma"><ChevronRight size={16}/>Comma</ToggleSelection>
                <ToggleSelection value="decimal"><Dot size={16}/>Decimal</ToggleSelection>
                <ToggleSelection value="moneysign"><PhilippinePeso size={16}/>Money sign</ToggleSelection>
            </ToggleContainer>                
        </>
    )
}

type DateOptionsProps = {
    date_formatting: headerSettingsItemInterface, 
    date_setFormatting: React.Dispatch<React.SetStateAction<headerSettingsItemInterface>>
    dates: {
        date_long: string,
        date_short: string,
        date_long_noyear: string,
        date_short_noyear: string,
        date_long_month: string,
        date_short_month: string
    }
}
function DateOptions({date_formatting, date_setFormatting, dates}: DateOptionsProps) {
    return(
    <>
        <p className="mt-2 text-sm font-semibold text-stone-700">Auto-format</p>
        <SelectionContainer selected={date_formatting} setSelected={date_setFormatting}>
            <BoxSelection value="datelong">{dates.date_long}</BoxSelection>
            <BoxSelection value="dateshort">{dates.date_short}</BoxSelection>
            <BoxSelection value="datelong-noyear">{dates.date_long_noyear}</BoxSelection>
            <BoxSelection value="dateshort-noyear">{dates.date_short_noyear}</BoxSelection>
            <BoxSelection value="datelong-month">{dates.date_long_month}</BoxSelection>
            <BoxSelection value="dateshort-month">{dates.date_short_month}</BoxSelection>
            {/* <BoxSelection value="date-monthyear">{dates.date_month_year}</BoxSelection> */}
            <BoxSelection value="datenone"><Ban size={16}/>None</BoxSelection>
        </SelectionContainer>                
    </>
    )
}

function CalculateMoney({calculate, setCalculate}: {calculate: headerSettingsItemInterface, setCalculate: React.Dispatch<React.SetStateAction<headerSettingsItemInterface>>}) {
    return(
        <>
            <p className="mt-2 text-sm font-semibold text-stone-700">Calculate</p>
            <SelectionContainer selected={calculate} setSelected={setCalculate}>
                <BoxSelection value="balance"><PiggyBank size={16}/>Balance</BoxSelection>
                <BoxSelection value=""><Ban size={16}/>None</BoxSelection>
            </SelectionContainer>
        </>
    )
}

function CalculateText({calculate, setCalculate}: {calculate: headerSettingsItemInterface, setCalculate: React.Dispatch<React.SetStateAction<headerSettingsItemInterface>>}) {
    return(
        <>
            <p className="mt-2 text-sm font-semibold text-stone-700">Calculate</p>
            <SelectionContainer selected={calculate} setSelected={setCalculate}>
                <BoxSelection value="auto-pr"><Hash size={16}/>Auto P/R</BoxSelection>
                <BoxSelection value=""><Ban size={16}/>None</BoxSelection>
            </SelectionContainer>
        </>
    )
}
export { ColumnTypeOptions, TextOptions, NumberOptions, MoneyOptions, DateOptions, CalculateMoney, CalculateText}