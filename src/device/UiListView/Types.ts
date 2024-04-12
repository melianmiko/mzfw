import { TextLayoutProvider } from "../System/TextLayoutProvider";
import { Component } from "../UiComponent";

export type ListItemProps = {
    title?: string,
    icon?: string,
    iconPosition?: "left"|"right",
    description?: string,
    titleColor?: number,
    descriptionColor?: number,
    onClick?(): any,
}

export type ListItemInternalMetrics = {
    textOffsetLeft: number,
    textBasedHeight: number,
    textBoxWidth: number,
    titleLayout: TextLayoutProvider,
    descriptionLayout: TextLayoutProvider,
}

export type ChildPositionInfo = {
    component: Component<any>,
    lastHeight: number,
    y: number,
}
