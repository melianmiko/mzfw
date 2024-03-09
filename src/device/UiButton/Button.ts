import { ButtonProps } from "./Types";
import { PaperComponent } from "../UiPaperComponent";
import { ButtonVariant } from "./Enums";
import { ZeppTextWidgetOptions } from "../../zosx/ui/WidgetOptionTypes";
import { align, deleteWidget, prop, text_style, widget } from "../../zosx/ui";
import { ZeppWidget } from "../../zosx/ui/Types";

const MPX_BUTTON_HEIGHT = 2.5;
const MPX_FULL_HEIGHT = 3;

/**
 * Common button component
 */
export class Button extends PaperComponent<ButtonProps> {
    private textView: ZeppWidget<ZeppTextWidgetOptions, {}> | null = null;
    private textNativeProps: ZeppTextWidgetOptions = {
        x: 0,
        y: 0,
        text: "",
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text_style: text_style.NONE,
        color: 0xFFFFFF,
    };

    constructor(props: ButtonProps) {
        super(props);
    }

    onInit() {
        super.onInit();
        if(!this.root) return;
        this.textNativeProps.text_size = this.root.theme.FONT_SIZE;
        this.props = {
            paperRadius: Math.floor((this.root.theme.FONT_SIZE * MPX_BUTTON_HEIGHT) / 2 - 2),
            paperBackgroundMarginV: Math.floor(this.root.theme.FONT_SIZE * (MPX_FULL_HEIGHT - MPX_BUTTON_HEIGHT) * 0.5),
            ...this.props,
        };
    }

    onRender() {
        super.onRender();
        if(!this.group) return

        this.textView = this.group.createWidget(widget.TEXT, this.textNativeProps);
        this.setupEventsAt(this.textView);
    }

    onDestroy() {
        deleteWidget(this.textView);
        super.onDestroy();
    }

    protected onPropertiesChange() {
        super.onPropertiesChange();
        this.applyColorScheme();
        this.textNativeProps.text = this.props.text;
    }

    protected onGeometryChange() {
        this.textNativeProps.w = this.geometry.w ?? 0;
        this.textNativeProps.h = this.geometry.h ?? 0;
        this.props.paperBackgroundMarginH = (this.geometry.w ?? 0) > 200 ? 48 : 0;
    }

    protected onComponentUpdate() {
        super.onComponentUpdate();
        if(this.textView) this.textView.setProperty(prop.MORE, this.textNativeProps as any);
    }

    onClick() {
        this.props.onClick && this.props.onClick();
    }

    protected getAutoHeight(): number {
        const fontSize: number = this.root ? this.root.theme.FONT_SIZE : 18;
        return fontSize * MPX_FULL_HEIGHT;
    }

    private applyColorScheme(): void {
        switch (this.props.variant) {
        case ButtonVariant.DEFAULT:
            this.colorDefault = 0x222222;
            this.colorSelected = 0x333333;
            this.colorPressed = 0x111111;
            break;
        case ButtonVariant.PRIMARY:
            if(!this.root) break;
            this.colorDefault = this.root.theme.ACCENT_COLOR;
            this.colorSelected = this.root.theme.ACCENT_COLOR_LIGHT;
            this.colorPressed = this.root.theme.ACCENT_COLOR_LIGHT;
            break;
        case ButtonVariant.DANGER:
            this.colorDefault = 0x640000;
            this.colorSelected = 0x980404;
            this.colorPressed = 0x3b0101;
            break;
        }
    }
}
