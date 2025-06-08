export type childrenType = { 
    children?: React.ReactNode
}
export type tableDataInterface = {
    children?: React.ReactNode
    ref?: React.RefObject<HTMLDivElement>
}
export type headerRowType = {
    children?: React.ReactNode
    className?: string
    ref?: React.RefObject<HTMLDivElement>
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}
export type rowType = {
    children?: React.ReactNode
    className?: string
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    ref?: React.RefObject<HTMLDivElement>
}

export type headerCellType = {
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
}

export type cellType = {
    className?: string
    children?: React.ReactNode
    style?: React.CSSProperties
}