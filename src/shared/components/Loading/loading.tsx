import { Loader } from 'lucide-react';
export function Loading() {
    return (
        <div className='flex flex-col items-center justify-center w-full h-screen text-pink-500'>
            <Loader size={32} className='shrink-0 animate-spin'/>
        </div>
    )
}