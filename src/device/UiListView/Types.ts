export type ListItemProps = {
    title?: string,
    icon?: string,
    iconPosition?: "left"|"right",
    description?: string,
    titleColor?: number,
    descriptionColor?: number,
    onClick?(): any,
}

export type ChildPositionInfo = {
    lastHeight: number,
    y: number,
}
