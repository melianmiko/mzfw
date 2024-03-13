import { AnimComponentProps } from "./Types";
import { anim_status, widget } from "../../zosx/ui";
import { ZeppWidgetID } from "../../zosx/ui/Types";
import { ZeppImgAnimWidgetOptions } from "../../zosx/ui/WidgetOptionTypes";
import { NativeComponent } from "./NativeComponent";

/**
 * systemUI.widget.IMG_ANIM wrapper component.
 */
export class AnimComponent extends NativeComponent<AnimComponentProps, ZeppImgAnimWidgetOptions> {
    protected widgetID: ZeppWidgetID = widget.IMG_ANIM;

    protected defaultProps: Partial<AnimComponentProps> = {
        repeatCount: 0,
    };

    protected nativeProps: ZeppImgAnimWidgetOptions = {
        anim_fps: 0,
        anim_path: "",
        anim_prefix: "",
        anim_size: 0,
        repeat_count: 0,
        x: 0,
        y: 0,
        anim_ext: "png",
        anim_repeat: true,
        anim_status: anim_status.START
    };

    updateProperties(): void {
        this.nativeProps.anim_path = this.props.imagesPath;
        this.nativeProps.anim_prefix = this.props.imagesPrefix;
        this.nativeProps.anim_fps = this.props.fps;
        this.nativeProps.anim_size = this.props.imagesCount;
        this.nativeProps.repeat_count = this.props.repeatCount ?? 0;
    }

    updateGeometry(): void {
        let x: number = this.geometry.x ?? 0;
        let y: number = this.geometry.y ?? 0;

        if(this.props.animationWidth && this.props.animationHeight) {
            x += Math.floor(Math.max(0, ((this.geometry.w ?? 0) - this.props.animationWidth) / 2));
            y += Math.floor(Math.max(0, ((this.geometry.h ?? 0) - this.props.animationHeight) / 2));
        }

        this.nativeProps.x = x;
        this.nativeProps.y = y;
    }

    protected getAutoHeight(): number {
        return this.props.animationHeight ?? 100;
    }
}
