import { ZeppWidget } from "../../zosx/ui/Types";
import {
    ZeppFillRectWidgetOptions,
    ZeppImgWidgetOptions,
    ZeppTextWidgetOptions
} from "../../zosx/ui/WidgetOptionTypes";

export type ImageOptionBarProps = {
    children: ImageOptionsBarItem[],
    backgroundNormal?: number,
    backgroundSelected?: number,
    backgroundDisabled?: number,
}

export type ImageOptionsBarItem = {
    icon: string,
    title: string,
    active: boolean,
    onClick: () => any,
}

export type ImageOptionBarView = {
    background?: ZeppWidget<ZeppFillRectWidgetOptions, {}>,
    backgroundProps: ZeppFillRectWidgetOptions,
    icon?: ZeppWidget<ZeppImgWidgetOptions, {}>,
    iconProps: ZeppImgWidgetOptions,
    title?: ZeppWidget<ZeppTextWidgetOptions, {}>,
    titleProps: ZeppTextWidgetOptions,
}
