import { ZeppFillRectWidgetOptions, ZeppImgWidgetOptions } from "../../zosx/ui/WidgetOptionTypes";
import { ZeppWidget } from "../../zosx/ui/Types";

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
