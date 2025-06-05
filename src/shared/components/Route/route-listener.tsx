import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const setPage = (page: string) => {
    localStorage.setItem('page', page)
}
export const getPage = () => {
    return localStorage.getItem('page')
}
export const clearPage = () => {
    return localStorage.removeItem('page')
}
    
export function RouteChangeListener() {
    const location = useLocation();

    useEffect(()=>{
        console.log("Location change: ", location)
        setPage(location.pathname);
        // return () => {
        //     clearPage();
        // }
    }, [location])


    return null
}