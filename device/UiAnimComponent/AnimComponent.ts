import {Component} from "../UiComponent";
import {IHmUIWidget} from "../System";
import {systemUi} from "../System";
import {AnimWidgetProps} from "./Types";

export class AnimComponent extends Component<AnimWidgetProps> {
    private nativeViewBg: IHmUIWidget;
    private nativeView: IHmUIWidget;

    onInit() {
        super.onInit();
        this.props = {
            repeatCount: 0,
            ...this.props,
        }
    }

    getAutoHeight(): number {
        return this.props.imageHeight;
    }

    protected onRender() {
        this.nativeViewBg = systemUi.createWidget(systemUi.widget.IMG, this.bgProps);
        this.nativeView = systemUi.createWidget(systemUi.widget.IMG_ANIM, this.nativeProps);
    }

    protected onDestroy() {
        systemUi.deleteWidget(this.nativeView);
        systemUi.deleteWidget(this.nativeViewBg);
    }

    onPropertiesOrGeometryChange() {
        if(this.isRendered) {
            this.nativeViewBg.setProperty(systemUi.prop.MORE, this.bgProps);
            this.nativeView.setProperty(systemUi.prop.MORE, this.nativeProps);
        }
    }

    private get bgProps(): any {
        return {
            ...this.geometry,
            src: "",
        }
    }

    private get nativeProps(): any {
        let {x, y, w, h} = this.geometry;
        if(this.props.imageWidth && this.props.imageHeight) {
            // Center animation into box
            x += Math.floor(Math.max(0, (w - this.props.imageWidth) / 2));
            y += Math.floor(Math.max(0, (h - this.props.imageHeight) / 2));
        }

        return {
            x,
            y,
            anim_path: this.props.imagesPath,
            anim_prefix: this.props.imagesPrefix,
            anim_ext: "png",
            anim_fps: this.props.fps,
            anim_size: this.props.imagesCount,
            anim_repeat: true,
            repeat_count: this.props.repeatCount,
            anim_status: (systemUi as any).anim_status.START,
        }
    }
}