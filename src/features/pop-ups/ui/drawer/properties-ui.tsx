import { Info, LucideProps } from "lucide-react"
import React from "react"
export function PropertiesUI({children}: {children?: React.ReactNode}){
    return (
        <div className="w-full flex flex-col gap-2
        border border-stone-200 rounded-md px-3 py-2">
            {children}
        </div>
    )
}
export function PropertiesHeader({icon: Icon, property_name, settings_name}: {property_name: string, settings_name: string, icon: React.ComponentType<LucideProps> | undefined}){
    return (
        <div className="flex flex-row justify-between items-center gap-2">
            <div className="flex flex-row items-center gap-2 text-stone-500">
                {Icon && <Icon size={16} />}
                <p className="text-sm font-semibold">{property_name}</p>                
            </div>
            <p className="text-xs text-stone-400">{settings_name}</p>
        </div>
    )
}

export function PropertiesInfo({children}: {children?: React.ReactNode}){
    return (
        <>
        <div className="flex flex-row items-center gap-1 text-stone-400">
            <Info size={16}/> 
            <p className="text-xs">Info</p>
            <hr className="w-full" />
        </div>
        <p className="text-xs text-stone-400">
            {children}
        </p>  
        </> 
    )
}