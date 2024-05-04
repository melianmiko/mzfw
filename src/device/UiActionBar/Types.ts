import { ZeppFillRectWidgetOptions, ZeppImgWidgetOptions } from "@zosx/types";
import { ZeppWidget } from "@zosx/types";

export type ActionBarProps = {
    children: ActionBarItem[],
    backgroundNormal?: number,
    backgroundSelected?: number,
    backgroundDisabled?: number,
}

export type ActionBarItem = {
    icon: string,
    disabled?: boolean,
    onClick: () => any,
}

export type ActionBarItemView = {
    background?: ZeppWidget<ZeppFillRectWidgetOptions, {}>,
    backgroundProps: ZeppFillRectWidgetOptions,
    icon?: ZeppWidget<ZeppImgWidgetOptions, {}>,
    iconProps: ZeppImgWidgetOptions,
}
