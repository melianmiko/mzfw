import {Component} from "../UiComponent";
import {Align, TextStyle} from "./Enums";
import {IHmUIWidget, systemUi} from "../System";
import {TextLayoutProvider} from "../SystemTools";
import {TextWidgetProps} from "./Types";

export class TextComponent extends Component<TextWidgetProps> {
    public isFocusable: boolean = false;

    private nativeView: IHmUIWidget;
    private textLayout = new TextLayoutProvider();

    onInit() {
        this.props = {
            color: 0xFFFFFF,
            alignH: Align.LEFT,
            alignV: Align.CENTER_V,
            text: "",
            textSize: this.root.baseFontSize - 4,
            textStyle: TextStyle.WRAP,
            ...this.props,
        }
    }

    protected onRender() {
        this.nativeView = systemUi.createWidget(systemUi.widget.TEXT, this.nativeProps);
        this.setupEventsAt(this.nativeView);
    }

    onPropertiesOrGeometryChange() {
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
            text: this.props.text,
            color: this.props.color,
            align_h: this.props.alignH,
            align_v: this.props.alignV,
            text_size: this.props.textSize,
            text_style: this.props.textStyle,
        };
    }

    getAutoHeight(): number {
        return this.textLayout.height;
    }
}