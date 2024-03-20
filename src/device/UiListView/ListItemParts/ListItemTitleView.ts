import type { ZeppTextWidgetOptions } from "../../../zosx/ui/WidgetOptionTypes";
import type { ZeppGroupInstance, ZeppWidget, ZeppWidgetID } from "../../../zosx/ui/Types";
import { NativeWidgetWrapper } from "../../UiTools/NativeWidgetWrapper";
import { text_style, widget } from "../../../zosx/ui";
import { UiTheme } from "../../UiCompositor";
import { ListItemInternalMetrics, ListItemProps } from "../Types";
import { ComponentGeometry } from "../../UiComponent";

export class ListItemTitleView extends NativeWidgetWrapper<ZeppTextWidgetOptions, {}> {
    protected widgetId: ZeppWidgetID = widget.TEXT;
    protected allowDestroyOnBand7: boolean = false;
    protected props: ZeppTextWidgetOptions = {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        text_size: 18,
        color: 0xFFFFFF,
        text_style: text_style.WRAP,
        text: "",
    };

    onViewRender(group: ZeppGroupInstance, setupEventsAt: (w: ZeppWidget<any, any>) => any) {
        this.group = group;
        super.onRender();
        this.widget && setupEventsAt(this.widget);
    }

    onChange(props: ListItemProps, geometry: ComponentGeometry, theme: UiTheme, metrics: ListItemInternalMetrics): void {
        this.shouldExist = !!props.title;

        this.props.text_size = theme.FONT_SIZE;
        this.props.color = props.titleColor;
        this.props.text = props.title ?? "";
        this.props.x = metrics.textOffsetLeft;
        this.props.y = Math.round(((geometry.h ?? 0) - metrics.textBasedHeight) / 2)
        this.props.w = metrics.textBoxWidth;
        this.props.h = metrics.titleLayout.height;
    }
}
