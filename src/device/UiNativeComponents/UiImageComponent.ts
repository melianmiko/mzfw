import { NativeComponent } from "./NativeComponent";
import { ImageComponentProps } from "./Types";
import { ZeppWidgetID } from "../../zosx/ui/Types";
import { widget } from "../../zosx/ui";
import { ZeppImgWidgetOptions } from "../../zosx/ui/WidgetOptionTypes";

export class ImageComponent extends NativeComponent<ImageComponentProps, ZeppImgWidgetOptions> {
    protected widgetID: ZeppWidgetID = widget.IMG;
    protected defaultProps: Partial<ImageComponentProps> = {};
    protected nativeProps: ZeppImgWidgetOptions = {
        x: 0,
        y: 0,
        src: "",
    };

    updateProperties(): void {
        this.nativeProps.src = this.props.src;
    }

    updateGeometry(): void {
        let x: number = this.geometry.x ?? 0;
        let y: number = this.geometry.y ?? 0;

        if(this.props.imageWidth && this.props.imageHeight) {
            x += Math.floor(Math.max(0, ((this.geometry.w ?? 0) - this.props.imageWidth) / 2));
            y += Math.floor(Math.max(0, ((this.geometry.h ?? 0) - this.props.imageHeight) / 2));
        }

        this.nativeProps.x = x;
        this.nativeProps.y = y;
    }

    protected getAutoHeight(): number {
        return this.props.imageHeight ?? 100;
    }
}
