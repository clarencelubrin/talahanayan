import { Text, CalendarFold, PhilippinePeso, Clock, Hash} from 'lucide-react'

const color = '#737373'
export function TemplateIcons({cell_name, className}: {cell_name: string, className: string}) {
    switch (cell_name) {
        case 'text':
            return <Text size={16} strokeWidth={2} color={color} className={className}/>
        case 'date':
        case 'day':
            return <CalendarFold size={16} strokeWidth={2} color={color} className={className}/>
        case 'time':
        case 'hour':
        case 'minute':
        case 'second':
            return <Clock size={16} strokeWidth={2} color={color} className={className}/>
        case 'debit':
        case 'credit':
        case 'balance':
            return <PhilippinePeso size={16} strokeWidth={2} color={color} className={className}/>
        case 'number':
        case 'amount':
        case 'p/r':
            return <Hash size={16} strokeWidth={2} color={color} className={className}/>
        default:
            return <Text size={16} strokeWidth={2} color={color} className={className}/>
    }
}