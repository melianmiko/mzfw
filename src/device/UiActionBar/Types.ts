import { IHmUIWidget, IZeppFillRectWidgetOptions, IZeppImgWidgetOptions, IZeppTextWidgetOptions } from "../System";

export type ActionBarItem = {
    icon: string,
    disabled?: boolean,
    onClick: () => any,
}

export type ActionBarItemView = {
    background?: IHmUIWidget,
    backgroundProps: IZeppFillRectWidgetOptions,
    icon?: IHmUIWidget,
    iconProps: IZeppImgWidgetOptions,
}
