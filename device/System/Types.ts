export type HmUIWidgetType = HmWearableProgram.DeviceSide.HmUI.HmUIWidgetType;
export type IHmUIWidget = HmWearableProgram.DeviceSide.HmUI.IHmUIWidget;
export type IHmUIWidgetOptions = HmWearableProgram.DeviceSide.HmUI.HmUIWidgetOptions;

export type INativeWidgetParent = {
    createWidget(widgetType: HmUIWidgetType, options: IHmUIWidgetOptions): IHmUIWidget;
}

export type IZeppPositionalWidgetOptions = {
    x?: number,
    y?: number,
    w?: number,
    h?: number,
}
export type IZeppFillRectWidgetOptions = IZeppPositionalWidgetOptions & {
    color?: number,
    radius?: number,
}

export type IZeppGroupWidgetOptions = IHmUIWidget & INativeWidgetParent;
