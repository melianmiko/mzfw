export type ListEntryWidgetProps = {
    title?: string,
    icon?: string,
    description?: string,
    titleColor?: number,
    descriptionColor?: number,
    onClick?(): any,
}

export type ChildPositionInfo = {
    lastHeight: number,
    y: number,
}
