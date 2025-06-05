import { useRef, useContext } from 'react';
import { ResizeClickEvent, ResizerProps } from 'src/features/tables/types/Resizer/resizer-interface';
import { TableFunctionContext } from 'src/features/tables/components/Table/table';
import 'src/App.css';

function Resizer({ setSheetWidths, thIndex, resizerRef, handleOnMouseUp }: ResizerProps) {
    const currentThRef = useRef<HTMLDivElement | null>(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);
    const { setScrollDisabled } = useContext(TableFunctionContext);
    // Mouse down handler
    const onResizeClick = (e: ResizeClickEvent) => {
        const currentTh = e.target.parentElement as HTMLDivElement;
        currentThRef.current = currentTh;
        startXRef.current = e.clientX;
        startWidthRef.current = currentTh.offsetWidth;

        document.body.style.userSelect = 'none';

        document.addEventListener('mousemove', resizeColumn);
        document.addEventListener('mouseup', stopResize);
    };

    // Touch start handler
    const onResizeTouch = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        const currentTh = e.target instanceof HTMLElement ? e.target.parentElement as HTMLDivElement : null;
        if (!currentTh) return;
        currentThRef.current = currentTh;
        startXRef.current = touch.clientX;
        startWidthRef.current = currentTh.offsetWidth;

        document.body.style.userSelect = 'none';

        document.addEventListener('touchmove', resizeColumnTouch);
        document.addEventListener('touchend', stopResizeTouch);
    };

    // Mouse move
    const resizeColumn = (e: MouseEvent) => {
        const width = startWidthRef.current + (e.clientX - startXRef.current);
        if (width > 35) {
            setSheetWidths((prev) => {
                const newState = [...prev];
                newState[thIndex] = width;
                return newState;
            });
        }
    };

    // Touch move
    const resizeColumnTouch = (e: TouchEvent) => {
        if (!e.touches.length) return;
        const touch = e.touches[0];
        const width = startWidthRef.current + (touch.clientX - startXRef.current);
        if (width > 35) {
            setSheetWidths((prev) => {
                const newState = [...prev];
                newState[thIndex] = width;
                return newState;
            });
            setScrollDisabled(true);
        }
    };

    // Mouse up
    const stopResize = () => {
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', resizeColumn);
        document.removeEventListener('mouseup', stopResize);
    };

    // Touch end
    const stopResizeTouch = () => {
        document.body.style.userSelect = '';
        document.removeEventListener('touchmove', resizeColumnTouch);
        document.removeEventListener('touchend', stopResizeTouch);
        setScrollDisabled(false);
    };

    return (
        <div
            className="resizer"
            onMouseDown={onResizeClick}
            onMouseUp={handleOnMouseUp}
            onTouchStart={onResizeTouch}
            ref={resizerRef}
        />
    );
}
export default Resizer;
