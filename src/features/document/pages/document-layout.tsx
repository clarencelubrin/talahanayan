import { Outlet } from "react-router"
import { Sidebar } from "../components/Sidebar/sidebar"
import { useState, createContext } from "react"

type DocumentContextType = {
    is_sidebar_open: boolean,
    setSidebarOpen: (value: boolean) => void
}
export const DocumentContext = createContext<DocumentContextType>({is_sidebar_open: true, setSidebarOpen: () => {}})
export function DocumentLayout() {
    const [is_sidebar_open, setSidebarOpen] = useState(localStorage.getItem('is_sidebar_open') === 'true' || false)
    return (
        <DocumentContext.Provider value={{is_sidebar_open, setSidebarOpen}}>
            <div className='flex flex-row w-full h-screen overflow-y-hidden'>
                <Sidebar isOpen={is_sidebar_open} setIsOpen={setSidebarOpen}/>
                <Outlet />
            </div>
        </DocumentContext.Provider>
    )
}