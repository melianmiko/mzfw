import {IZeppFillRectWidgetOptions, systemUi} from "../System";
import {NativeComponent} from "./NativeComponent";
import {UiDrawRectangleComponentProps} from "./Types";

/**
 * systemUI.widget.FILL_RECT wrapper component.
 */
export class UiDrawRectangleComponent extends NativeComponent<UiDrawRectangleComponentProps, IZeppFillRectWidgetOptions> {
    protected widgetID: number = systemUi.widget.FILL_RECT;
    protected nativeProps: IZeppFillRectWidgetOptions = {};
    protected defaultProps: UiDrawRectangleComponentProps = {
        height: 10,
        color: 0x222222,
        radius: 0,
    }

    updateProperties(): void {
        this.nativeProps = {
            h: this.props.height,
            radius: this.props.radius,
            color: this.props.color,
            ...this.nativeProps,
        }
    }

    updateGeometry(): void {
        this.nativeProps = {
            x: this.geometry.x,
            y: this.geometry.y,
            w: this.geometry.w,
            ...this.nativeProps,
        }
    }

    getAutoHeight(): number {
        return this.props.height;
    }
}
