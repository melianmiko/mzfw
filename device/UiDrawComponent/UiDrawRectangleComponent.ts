import {IZeppFillRectWidgetOptions, systemUi} from "../System";
import {NativeComponent} from "../SystemTools/NativeComponent";
import {UiDrawRectangleComponentProps} from "./Types";


export class UiDrawRectangleComponent extends NativeComponent<UiDrawRectangleComponentProps, IZeppFillRectWidgetOptions> {
    protected widgetID: number = systemUi.widget.FILL_RECT;
    protected nativeProps: IZeppFillRectWidgetOptions = {};
    protected defaultProps: UiDrawRectangleComponentProps = {
        height: 10,
        color: 0x222222,
        radius: 0,
    }

    updateProperties(): void {
        this.nativeProps.radius = this.props.radius;
        this.nativeProps.color = this.props.color;
        this.nativeProps.h = this.props.height;
        this.nativeProps.x = this.geometry.x;
        this.nativeProps.y = this.geometry.y;
        this.nativeProps.w = this.geometry.w;
    }

    getAutoHeight(): number {
        return this.props.height;
    }
}
