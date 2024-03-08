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

export type IZeppImgWidgetOptions = IZeppPositionalWidgetOptions & {
    src: string,
    pad_x?: string,
    pad_y?: string,
}

export type IZeppTextWidgetOptions = IZeppPositionalWidgetOptions & {
    text: string,
    color?: number,
    align_h?: number,
    align_v?: number,
    text_size?: number,
    text_style?: number,
}

export type IZeppAnimWidgetOptions = Partial<{
    x: number,
    y: number,
    anim_path: string,
    anim_prefix: string,
    anim_ext: string,
    anim_fps: number,
    repeat_count: number,
    anim_repeat?: boolean,
    anim_size: number
    anim_status: number
}>;

export type IZeppGroupWidgetOptions = IHmUIWidget & INativeWidgetParent;
