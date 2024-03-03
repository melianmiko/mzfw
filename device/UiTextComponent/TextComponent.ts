import {Component} from "../UiComponent";
import {Align, TextStyle} from "./Enums";
import {IHmUIWidget, IZeppTextWidgetOptions, systemUi} from "../System";
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

    updateProperties(): void {
        // console.log("updateProps");
        this.nativeProps.text = this.props.text;
        this.nativeProps.color = this.props.color;
        this.nativeProps.align_h = this.props.alignH;
        this.nativeProps.align_v = this.props.alignV;
        this.nativeProps.text_style = this.props.textStyle;
        this.nativeProps.text_size = this.props.textSize || this.root.theme.FONT_SIZE - 4;
        this.nativeProps.w = this.geometry.w - this.props.marginH * 2;
        this.textLayout.performUpdate(this.props.text, this.nativeProps.w, this.nativeProps.text_size);
    }

    updateGeometry(): void {
        // console.log("updateGeometry");
        this.nativeProps.x = this.geometry.x + this.props.marginH;
        this.nativeProps.y = this.geometry.y + this.props.marginV;
        this.nativeProps.w = this.geometry.w - this.props.marginH * 2;
        this.nativeProps.h = this.geometry.h - this.props.marginV * 2;
        this.textLayout.performUpdate(this.props.text, this.nativeProps.w, this.nativeProps.text_size);
    }

    protected getAutoHeight(): number {
        // console.log("getAH", this.textLayout.height);
        // console.log(this.textLayout.height, JSON.stringify(this.props), JSON.stringify(this.geometry))
        return this.textLayout.height + this.props.marginV * 2;
    }
}

export class TextComponent1 extends Component<TextComponentProps> {
    public isFocusable: boolean = false;

    private nativeView: IHmUIWidget;
    private textLayout = new TextLayoutProvider();

    onInit() {
        this.props = {
            color: 0xFFFFFF,
            alignH: Align.LEFT,
            alignV: Align.CENTER_V,
            text: "",
            textSize: this.root.theme.FONT_SIZE - 4,
            textStyle: TextStyle.WRAP,
            marginH: 0,
            marginV: 0,
            ...this.props,
        }
    }

    protected onRender() {
        this.nativeView = systemUi.createWidget(systemUi.widget.TEXT, this.nativeProps);
        this.setupEventsAt(this.nativeView);
    }

    onPropertiesChange() {
        this.textLayout.performUpdate(this.props.text, this.geometry.w, this.props.textSize);
    }

    onComponentUpdate() {
        this.nativeView.setProperty(systemUi.prop.MORE, this.nativeProps);
    }

    protected onDestroy() {
        systemUi.deleteWidget(this.nativeView);
    }

    private get nativeProps() : any {
        return {
            ...this.geometry,
            x: this.geometry.x + this.props.marginH,
            y: this.geometry.y + this.props.marginV,
            w: this.geometry.w - this.props.marginH * 2,
            h: this.geometry.h - this.props.marginV * 2,
            text: this.props.text,
            color: this.props.color,
            align_h: this.props.alignH,
            align_v: this.props.alignV,
            text_size: this.props.textSize,
            text_style: this.props.textStyle,
        };
    }

    getAutoHeight(): number {
        return this.textLayout.height + this.props.marginV * 2;
    }
}