export type ListEntryWidgetProps = {
    title: string,
    icon?: string,
    description?: string,
    textColor?: number,
    descriptionColor?: number,
    onClick?(): any,
    onLongClick?(): any,
}

export type ChildPositionInfo = {
    lastHeight: number,
    y: number,
}
