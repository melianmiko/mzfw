import { NativeWidgetWrapper } from "../../UiTools/NativeWidgetWrapper";
import type { ZeppGroupInstance, ZeppWidget, ZeppWidgetID } from "@zosx/types";
import { ZeppTextWidgetOptions } from "@zosx/types";
import { text_style, widget } from "@zosx/ui";
import { ListItemInternalMetrics, ListItemProps } from "../Types";
import { ComponentGeometry, UiTheme } from "../../UiComponent";
import { DESCRIPTION_SIZE_DELTA } from "../ListItemSizes";

export class ListItemDescriptionView extends NativeWidgetWrapper<ZeppTextWidgetOptions, {}> {
    protected widgetId: ZeppWidgetID = widget.TEXT;
    protected allowDestroyOnBand7: boolean = false;
    protected props: ZeppTextWidgetOptions = {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        text_size: 18,
        color: 0x999999,
        text_style: text_style.WRAP,
        text: "",
    };

    onViewRender(group: ZeppGroupInstance, setupEventsAt: (w: ZeppWidget<any, any>) => any) {
        this.group = group;
        super.onRender();
        this.widget && setupEventsAt(this.widget);
    }

    onChange(props: ListItemProps, geometry: ComponentGeometry, theme: UiTheme, metrics: ListItemInternalMetrics): void {
        this.shouldExist = !!props.description;

        this.props.text_size = theme.FONT_SIZE - DESCRIPTION_SIZE_DELTA;
        this.props.color = props.descriptionColor;
        this.props.text = props.description ?? "";
        this.props.x = metrics.textOffsetLeft;
        this.props.y = Math.round(((geometry.h ?? 0) - metrics.textBasedHeight) / 2) + metrics.titleLayout.height;
        this.props.w = metrics.textBoxWidth;
        this.props.h = metrics.descriptionLayout.height;
    }
}
