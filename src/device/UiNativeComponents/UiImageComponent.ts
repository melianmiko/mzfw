import { NativeComponent } from "./NativeComponent";
import { IZeppImgWidgetOptions, systemUi } from "../System";
import { ImageComponentProps } from "./Types";

export class ImageComponent extends NativeComponent<ImageComponentProps, IZeppImgWidgetOptions> {
    protected widgetID: number = systemUi.widget.IMG;
    protected defaultProps: Partial<ImageComponentProps> = {};
    protected nativeProps: IZeppImgWidgetOptions = {src: ""};

    updateProperties(): void {
        this.nativeProps.src = this.props.src;
    }

    updateGeometry(): void {
        let {x, y, w, h} = this.geometry;
        if(this.props.imageWidth && this.props.imageHeight) {
            x += Math.floor(Math.max(0, (w - this.props.imageWidth) / 2));
            y += Math.floor(Math.max(0, (h - this.props.imageHeight) / 2));
        }

        this.nativeProps.x = x;
        this.nativeProps.y = y;
    }

    protected getAutoHeight(): number {
        return this.props.imageHeight ?? 100;
    }
}
