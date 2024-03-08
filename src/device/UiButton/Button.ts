import { ButtonProps } from "./Types";
import { PaperComponent } from "../UiPaperComponent";
import { ButtonVariant } from "./Enums";
import { IHmUIWidget, IZeppTextWidgetOptions, systemUi } from "../System";
import { WIDGET_WIDTH } from "../UiProperties";

const MPX_BUTTON_HEIGHT = 2.5;
const MPX_FULL_HEIGHT = 3;

/**
 * Common button component
 */
export class Button extends PaperComponent<ButtonProps> {
    private textView: IHmUIWidget;
    private textNativeProps: IZeppTextWidgetOptions = {
        x: 0,
        y: 0,
        text: "",
        align_h: systemUi.align.CENTER_H,
        align_v: systemUi.align.CENTER_V,
        text_style: systemUi.text_style.NONE,
        color: 0xFFFFFF,
    };

    constructor(props: ButtonProps) {
        super(props);
    }

    onInit() {
        super.onInit();
        this.textNativeProps.text_size = this.root.theme.FONT_SIZE;
        this.props = {
            paperRadius: Math.floor((this.root.theme.FONT_SIZE * MPX_BUTTON_HEIGHT) / 2 - 2),
            paperBackgroundMarginV: Math.floor(this.root.theme.FONT_SIZE * (MPX_FULL_HEIGHT - MPX_BUTTON_HEIGHT) * 0.5),
            ...this.props,
        };
    }

    onRender() {
        super.onRender();
        this.textView = this.group.createWidget(systemUi.widget.TEXT, this.textNativeProps);
        this.setupEventsAt(this.textView);
    }

    onDestroy() {
        systemUi.deleteWidget(this.textView);
        super.onDestroy();
    }

    protected onPropertiesChange() {
        super.onPropertiesChange();
        this.applyColorScheme();
        this.textNativeProps.text = this.props.text;
    }

    protected onGeometryChange() {
        this.textNativeProps.w = this.geometry.w;
        this.textNativeProps.h = this.geometry.h;
        this.props.paperBackgroundMarginH = this.geometry.w > 200 ? 48 : 0;
    }

    protected onComponentUpdate() {
        super.onComponentUpdate();
        this.textView.setProperty(systemUi.prop.MORE, this.textNativeProps as any);
    }

    onClick() {
        if(this.props.onClick)
            this.props.onClick();
    }

    protected getAutoHeight(): number {
        return this.root.theme.FONT_SIZE * MPX_FULL_HEIGHT;
    }

    private applyColorScheme(): void {
        switch (this.props.variant) {
        case ButtonVariant.DEFAULT:
            this.colorDefault = 0x222222;
            this.colorSelected = 0x333333;
            this.colorPressed = 0x111111;
            break;
        case ButtonVariant.PRIMARY:
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
