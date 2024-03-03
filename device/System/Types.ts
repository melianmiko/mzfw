export type HmUIWidgetType = HmWearableProgram.DeviceSide.HmUI.HmUIWidgetType;
export type IHmUIWidget = HmWearableProgram.DeviceSide.HmUI.IHmUIWidget;
export type IHmUIWidgetOptions = HmWearableProgram.DeviceSide.HmUI.HmUIWidgetOptions;

export type INativeWidgetParent = {
    createWidget(widgetType: HmUIWidgetType, options: IHmUIWidgetOptions): IHmUIWidget;
}
export type IUnsafeMemInfoProvider = {
    getMemUsage(): number,
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
export type IZeppTextWidgetOptions = IZeppPositionalWidgetOptions & {
    text: string,
    color?: number,
    align_h?: number,
    align_v?: number,
    text_size?: number,
    text_style?: number,
}

export type IZeppGroupWidgetOptions = IHmUIWidget & INativeWidgetParent;
