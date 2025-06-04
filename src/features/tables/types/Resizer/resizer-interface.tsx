export type ResizerProps = {
    setSheetWidths: React.Dispatch<React.SetStateAction<number[]>>;
    thIndex: number;
    resizerRef: React.RefObject<HTMLDivElement>;
    handleOnMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
};
export interface ResizeClickEvent extends React.MouseEvent<HTMLDivElement> {
    target: HTMLDivElement & EventTarget;
}