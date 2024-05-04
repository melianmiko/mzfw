import { NativeWidgetWrapper } from "../../UiTools/NativeWidgetWrapper";
import type { ZeppGroupInstance, ZeppImgWidgetOptions, ZeppWidget, ZeppWidgetID } from "@zosx/types";
import { widget } from "@zosx/ui";
import { ListItemProps } from "../Types";
import { ComponentGeometry } from "../../UiComponent";
import { ICON_OFFSET, ICON_SIZE } from "../../UiProperties";
import { VERT_MARGIN } from "../ListItemSizes";
import { handleIconProperty } from "../../UiTools";

export class ListItemIconView extends NativeWidgetWrapper<ZeppImgWidgetOptions, {}> {
    protected widgetId: ZeppWidgetID = widget.IMG;
    protected props: ZeppImgWidgetOptions = {
        x: 0,
        y: 0,
        w: ICON_SIZE,
        h: ICON_SIZE,
        src: "",
    };

    onViewRender(group: ZeppGroupInstance, setupEventsAt: (w: ZeppWidget<any, any>) => any) {
        this.group = group;
        super.onRender();
        this.widget && setupEventsAt(this.widget);
    }

    onChange(props: ListItemProps, geometry: ComponentGeometry): void {
        this.shouldExist = !!props.icon;

        this.props.x = props.iconPosition == "right" ? (geometry.w ?? 0) - ICON_SIZE - ICON_OFFSET : ICON_OFFSET;
        this.props.y = props.description ? VERT_MARGIN : Math.floor(((geometry.h ?? 0) - ICON_SIZE) / 2)
        this.props.src = handleIconProperty(props.icon ?? "", ICON_SIZE);
    }
}
