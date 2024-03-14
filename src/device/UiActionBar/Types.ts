import { ZeppFillRectWidgetOptions, ZeppImgWidgetOptions } from "../../zosx/ui/WidgetOptionTypes";
import { ZeppWidget } from "../../zosx/ui/Types";

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
