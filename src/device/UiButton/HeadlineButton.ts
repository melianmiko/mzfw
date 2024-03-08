import { Component, TouchEventData } from "../UiComponent";
import { HeadlineButtonProps } from "./Types";
import { TextLayoutProvider } from "../SystemTools";
import { IS_BAND_7, IS_SMALL_SCREEN_DEVICE, WIDGET_WIDTH } from "../UiProperties";
import {
    IHmUIWidget,
    IZeppFillRectWidgetOptions,
    IZeppImgWidgetOptions,
    IZeppTextWidgetOptions,
    systemUi
} from "../System";

const BTN_PADDING = 8;
const SIZE_OPTION = IS_SMALL_SCREEN_DEVICE ? (IS_BAND_7 ? 0 : 1) : 2;
const ICON_SIZE = [32, 24, 32][SIZE_OPTION];
const TEXT_SIZE = [0, 20, 22][SIZE_OPTION];

/**
 * Headline button, for use in header/footer of page.
 * Required icon sizes: 24, 32
 */
export class HeadlineButton extends Component<HeadlineButtonProps> {
    public isFocusable: boolean = true;

    private textLayout: TextLayoutProvider = new TextLayoutProvider();
    private backgroundView: IHmUIWidget;
    private iconView: IHmUIWidget;
    private textView: IHmUIWidget;

    private backgroundProps: IZeppFillRectWidgetOptions = {
        color: 0x222222,
        h: ICON_SIZE + BTN_PADDING * 2,
        radius: Math.floor(ICON_SIZE / 2) + (BTN_PADDING - 1),
    };

    private iconProps: IZeppImgWidgetOptions = {
        w: ICON_SIZE,
        h: ICON_SIZE,
        src: "",
    };

    private textProps: IZeppTextWidgetOptions = {
        h: ICON_SIZE,
        text: "",
        text_style: systemUi.text_style.NONE,
        text_size: TEXT_SIZE,
        align_v: systemUi.align.CENTER_V,
    };

    onInit() {
        super.onInit();
    }

    protected onPropertiesChange() {
        this.refreshWidth();

        this.iconProps.src = `icon/${ICON_SIZE}/${this.props.icon}.png`;

        this.textProps.text = this.props.text;
        this.textProps.color = this.props.textColor ?? 0xFFFFFF;
    }

    protected onGeometryChange() {
        this.refreshWidth();

        this.backgroundProps.y = this.geometry.y + Math.floor((this.geometry.h - this.backgroundProps.h) / 2);

        this.iconProps.x = this.backgroundProps.x + BTN_PADDING * (SIZE_OPTION == 0 ? 1 : 2);
        this.iconProps.y = this.backgroundProps.y + BTN_PADDING;

        if(SIZE_OPTION > 0) {
            this.textProps.x = this.iconProps.x + BTN_PADDING + ICON_SIZE;
            this.textProps.y = this.backgroundProps.y + BTN_PADDING;
            this.textProps.w = this.textLayout.width;
        }
    }

    protected onRender(): any {
        this.backgroundView = systemUi.createWidget(systemUi.widget.FILL_RECT, this.backgroundProps);
        this.setupEventsAt(this.backgroundView);
        this.iconView = systemUi.createWidget(systemUi.widget.IMG, this.iconProps);
        this.setupEventsAt(this.iconView);

        if(SIZE_OPTION > 0) {
            this.textView = systemUi.createWidget(systemUi.widget.TEXT, this.textProps);
            this.setupEventsAt(this.textView);
        }
    }

    protected onDestroy(): any {
        if(SIZE_OPTION > 0) systemUi.deleteWidget(this.textView);
        systemUi.deleteWidget(this.iconView);
        systemUi.deleteWidget(this.backgroundView);
    }

    protected onComponentUpdate() {
        this.backgroundView.setProperty(systemUi.prop.MORE, this.backgroundProps as any);
        this.iconView.setProperty(systemUi.prop.MORE, this.iconProps as any);
        if(SIZE_OPTION > 0) this.textView.setProperty(systemUi.prop.MORE, this.textProps as any);
    }

    protected getAutoHeight(): number {
        return ICON_SIZE + BTN_PADDING * 4;
    }

    private refreshWidth() {
        if(SIZE_OPTION > 0) {
            this.textLayout.performUpdate(this.props.text, WIDGET_WIDTH, TEXT_SIZE);
            this.backgroundProps.w = this.textLayout.width + ICON_SIZE + BTN_PADDING * 5;
        } else {
            this.backgroundProps.w = ICON_SIZE + BTN_PADDING * 2;
        }

        this.backgroundProps.x = this.geometry.x + Math.floor((this.geometry.w - this.backgroundProps.w) / 2);
    }

    onWheelClick(): boolean {
        if(this.props.onClick) {
            this.props.onClick();
            return true;
        }
        return false;
    }

    onTouchDown(data: TouchEventData): boolean {
        this.backgroundProps.color = 0x444444;
        this.backgroundView.setProperty(systemUi.prop.MORE, this.backgroundProps as any);

        return super.onTouchDown(data);
    }

    onTouchMove(data: TouchEventData): boolean {
        this.backgroundProps.color = 0x222222;
        this.backgroundView.setProperty(systemUi.prop.MORE, this.backgroundProps as any);

        return super.onTouchMove(data);
    }

    onTouchUp(data: TouchEventData): boolean {
        this.backgroundProps.color = 0x222222;
        this.backgroundView.setProperty(systemUi.prop.MORE, this.backgroundProps as any);

        if(this.props.onClick) this.props.onClick();
        return super.onTouchUp(data);
    }

    onFocus() {
        this.backgroundProps.color = 0x444444;
        this.backgroundView.setProperty(systemUi.prop.MORE, this.backgroundProps as any);
    }

    onBlur() {
        this.backgroundProps.color = 0x222222;
        this.backgroundView.setProperty(systemUi.prop.MORE, this.backgroundProps as any);
    }
}
