import {Align, TextStyle} from "./Enums";
import {IZeppTextWidgetOptions, systemUi} from "../System";
import {TextLayoutProvider} from "../SystemTools";
import {TextComponentProps} from "./Types";
import {NativeComponent} from "../SystemTools/NativeComponent";

export class TextComponent extends NativeComponent<TextComponentProps, IZeppTextWidgetOptions> {
    public isFocusable: boolean = false;

    protected widgetID: number = systemUi.widget.TEXT;
    protected nativeProps: IZeppTextWidgetOptions = {text: ""};
    protected defaultProps: Partial<TextComponentProps> = {
        color: 0xFFFFFF,
        alignH: Align.LEFT,
        alignV: Align.CENTER_V,
        text: "",
        textStyle: TextStyle.WRAP,
        marginH: 0,
        marginV: 0,
    };

    private textLayout = new TextLayoutProvider();

    onInit() {
        super.onInit();
        if(!this.props.textSize)
            this.props.textSize = this.root.theme.FONT_SIZE;
    }

    updateProperties(): void {
        this.nativeProps = {
            ...this.nativeProps,
            text: this.props.text,
            color: this.props.color,
            align_h: this.props.alignH,
            align_v: this.props.alignV,
            text_size: this.props.textSize,
            text_style: this.props.textStyle,
            w: this.geometry.w - this.props.marginH * 2,
        }
        this.textLayout.performUpdate(this.props.text, this.nativeProps.w, this.nativeProps.text_size);
    }

    updateGeometry(): void {
        // console.log("updateGeometry");
        this.nativeProps = {
            ...this.nativeProps,
            x: this.geometry.x + this.props.marginH,
            y: this.geometry.y + this.props.marginV,
            w: this.geometry.w - this.props.marginH * 2,
            h: this.geometry.h - this.props.marginV * 2,
        }
        this.textLayout.performUpdate(this.props.text, this.nativeProps.w, this.nativeProps.text_size);
    }

    protected getAutoHeight(): number {
        return this.textLayout.height + this.props.marginV * 2;
    }
}
