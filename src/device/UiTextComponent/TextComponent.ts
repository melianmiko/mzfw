import { TextLayoutProvider } from "../System/TextLayoutProvider";
import { TextComponentProps } from "./Types";
import { NativeComponent } from "../UiNativeComponents";
import { align, text_style, widget } from "@zosx/ui";
import { ZeppTextWidgetOptions, ZeppWidgetID } from "@zosx/types";

export class TextComponent extends NativeComponent<TextComponentProps, ZeppTextWidgetOptions> {
    public isFocusable: boolean = false;
    public preventDestroyOnLegacyDevices: boolean = true;

    protected widgetID: ZeppWidgetID = widget.TEXT;
    protected nativeProps: ZeppTextWidgetOptions = {
        x: 0,
        y: 0,
        text: ""
    };

    protected defaultProps: Partial<TextComponentProps> = {
        color: 0xFFFFFF,
        alignH: align.LEFT,
        alignV: align.CENTER_V,
        text: "",
        textStyle: text_style.WRAP,
        marginH: 0,
        marginV: 0,
    };

    private textLayout = new TextLayoutProvider();

    onInit() {
        super.onInit();
        this.props.textSize = this.props.textSize ?? this.root?.theme.FONT_SIZE ?? 18;
        this.props.color = this.props.color ?? this.root?.theme.TEXT_COLOR ?? 0xFFFFFF;
    }

    protected updateProperties(): void {
        this.nativeProps = {
            ...this.nativeProps,
            text: this.props.text,
            color: this.props.color,
            align_h: this.props.alignH,
            align_v: this.props.alignV,
            text_size: this.props.textSize,
            text_style: this.props.textStyle,
            w: (this.geometry.w ?? 0) - (this.props.marginH ?? 0) * 2,
        }
        this.textLayout.performUpdate(this.props.text, this.nativeProps.w ?? 0, this.nativeProps.text_size ?? 0);
    }

    protected updateGeometry(): void {
        const mh = this.props.marginH ?? 0;
        const mv = this.props.marginV ?? 0;
        this.nativeProps = {
            ...this.nativeProps,
            x: (this.geometry.x ?? 0) + mh,
            y: (this.geometry.y ?? 0) + mv,
            w: (this.geometry.w ?? 0) - mh * 2,
            h: (this.geometry.h ?? 0) - mv * 2,
        }
        this.textLayout.performUpdate(this.props.text, this.nativeProps.w ?? 0, this.nativeProps.text_size ?? 0);
    }

    protected getAutoHeight(): number {
        return this.textLayout.height + (this.props.marginV ?? 0) * 2;
    }
}
