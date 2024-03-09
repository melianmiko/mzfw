import { NativeComponent } from "./NativeComponent";
import { UiDrawRectangleComponentProps } from "./Types";
import { ZeppFillRectWidgetOptions } from "../../zosx/ui/WidgetOptionTypes";
import { ZeppWidgetID } from "../../zosx/ui/Types";
import { widget } from "../../zosx/ui";

/**
 * systemUI.widget.FILL_RECT wrapper component.
 */
export class UiDrawRectangleComponent extends NativeComponent<UiDrawRectangleComponentProps, ZeppFillRectWidgetOptions> {
    protected widgetID: ZeppWidgetID = widget.FILL_RECT;
    protected nativeProps: ZeppFillRectWidgetOptions = {x: 0, y: 0, w: 0, h: 0,};
    protected defaultProps: UiDrawRectangleComponentProps = {
        height: 10,
        color: 0x222222,
        radius: 0,
    }

    updateProperties(): void {
        this.nativeProps.radius = this.props.radius;
        this.nativeProps.color = this.props.color;
    }

    updateGeometry(): void {
        if(this.geometry.x) this.nativeProps.x = this.geometry.x;
        if(this.geometry.y) this.nativeProps.y = this.geometry.y;
        if(this.geometry.w) this.nativeProps.w = this.geometry.w;
        if(this.geometry.h) this.nativeProps.h = this.geometry.h;
    }

    getAutoHeight(): number {
        return this.props.height ?? 50;
    }
}
