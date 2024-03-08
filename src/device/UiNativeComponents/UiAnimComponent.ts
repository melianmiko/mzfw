import { IZeppAnimWidgetOptions, systemUi } from "../System";
import { AnimComponentProps } from "./Types";
import { NativeComponent } from "../SystemTools";

/**
 * systemUI.widget.IMG_ANIM wrapper component.
 */
export class AnimComponent extends NativeComponent<AnimComponentProps, IZeppAnimWidgetOptions> {
    protected widgetID: number = systemUi.widget.IMG_ANIM;

    protected defaultProps: Partial<AnimComponentProps> = {
        repeatCount: 0,
    };
    protected nativeProps: IZeppAnimWidgetOptions = {
        anim_ext: "png",
        anim_repeat: true,
        anim_status: (systemUi as any).anim_status.START,
    };

    updateProperties(): void {
        this.nativeProps.anim_path = this.props.imagesPath;
        this.nativeProps.anim_prefix = this.props.imagesPrefix;
        this.nativeProps.anim_fps = this.props.fps;
        this.nativeProps.anim_size = this.props.imagesCount;
        this.nativeProps.repeat_count = this.props.repeatCount;
    }

    updateGeometry(): void {
        let {x, y, w, h} = this.geometry;
        if(this.props.animationWidth && this.props.animationHeight) {
            // Center animation into box
            x += Math.floor(Math.max(0, (w - this.props.animationWidth) / 2));
            y += Math.floor(Math.max(0, (h - this.props.animationHeight) / 2));
        }

        this.nativeProps.x = x;
        this.nativeProps.y = y;
    }

    protected getAutoHeight(): number {
        return this.props.animationHeight ?? 100;
    }
}
