import { ZeppWidgetAlignMode, ZeppWidgetAnimStatus, ZeppWidgetShowLevel, ZeppWidgetTextStyle } from "./Types";

export type ZeppWidgetGenericOptions = {
    alpha?: number,
    show_level?: ZeppWidgetShowLevel,
}

export type ZeppWidgetPositionOptions = {
    x: number,
    y: number,
    w?: number,
    h?: number,
}

export type ZeppTextWidgetOptions = ZeppWidgetGenericOptions & ZeppWidgetPositionOptions & {
    text: string,
    color?: number,
    align_h?: ZeppWidgetAlignMode,
    align_v?: ZeppWidgetAlignMode,
    text_size?: number,
    text_style?: ZeppWidgetTextStyle,
}

export type ZeppFillRectWidgetOptions = ZeppWidgetGenericOptions & Required<ZeppWidgetPositionOptions> & {
    color?: number,
    radius?: number,
}

export type ZeppImgWidgetOptions = ZeppWidgetGenericOptions & ZeppWidgetPositionOptions & {
    src: string,
    pad_x?: string,
    pad_y?: string,
}

export type ZeppImgAnimWidgetOptions = ZeppWidgetGenericOptions & {
    x: number,
    y: number,
    anim_path: string,
    anim_prefix: string,
    anim_ext: string,
    anim_fps: number,
    repeat_count: number,
    anim_repeat?: boolean,
    anim_size: number,
    anim_status: ZeppWidgetAnimStatus,
}
