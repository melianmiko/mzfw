import { Component } from "../UiComponent";
import { HeadlineButtonProps } from "./Types";
import { TextLayoutProvider } from "../System/TextLayoutProvider";
import { IS_BAND_7, IS_SMALL_SCREEN_DEVICE, WIDGET_WIDTH } from "../UiProperties";
import {
    ZeppFillRectWidgetOptions,
    ZeppImgWidgetOptions,
    ZeppTextWidgetOptions,
    ZeppWidget,
    ZeppWidgetEventData
} from "@zosx/types";
import { align, createWidget, deleteWidget, prop, text_style, widget } from "@zosx/ui";

const BTN_PADDING = 8;
const SIZE_OPTION = IS_SMALL_SCREEN_DEVICE ? (IS_BAND_7 ? 0 : 1) : 2;
const ICON_SIZE = [48, 32, 48][SIZE_OPTION];

/**
 * Headline button, for use in header/footer of page.
 * Required icon sizes: 24, 32
 */
export class HeadlineButton extends Component<HeadlineButtonProps> {
    public isFocusable: boolean = true;

    private textLayout: TextLayoutProvider = new TextLayoutProvider();
    private backgroundView: ZeppWidget<ZeppFillRectWidgetOptions, {}> | null = null;
    private iconView: ZeppWidget<ZeppImgWidgetOptions, {}> | null = null;
    private textView: ZeppWidget<ZeppTextWidgetOptions, {}> | null = null;

    private backgroundProps: ZeppFillRectWidgetOptions = {
        x: 0,
        y: 0,
        w: 0,
        h: ICON_SIZE + BTN_PADDING * 2,
        color: 0x222222,
        radius: Math.floor(ICON_SIZE / 2) + (BTN_PADDING - 1)
    };

    private iconProps: ZeppImgWidgetOptions = {
        x: 0,
        y: 0,
        w: ICON_SIZE,
        h: ICON_SIZE,
        src: ""
    };

    private textProps: ZeppTextWidgetOptions = {
        x: 0,
        y: 0,
        h: ICON_SIZE,
        text: "",
        text_style: text_style.NONE,
        text_size: 20,
        align_v: align.CENTER_V,
    };

    onInit() {
        super.onInit();
    }

    protected onPropertiesChange() {
        this.refreshWidth();

        this.iconProps.src = `icon/${ICON_SIZE}/${this.props.icon}.png`;

        this.textProps.text = this.props.text;
        this.textProps.color = this.props.textColor ?? this.root?.theme.BUTTON_TEXT ?? 0xFFFFFF;
    }

    protected onGeometryChange() {
        this.refreshWidth();

        this.backgroundProps.y = (this.geometry.y ?? 0) + Math.floor(((this.geometry.h ?? 0) - this.backgroundProps.h) / 2);

        this.iconProps.x = this.backgroundProps.x + BTN_PADDING * (SIZE_OPTION == 0 ? 1 : 2);
        this.iconProps.y = this.backgroundProps.y + BTN_PADDING;

        if(SIZE_OPTION > 0) {
            this.textProps.x = this.iconProps.x + BTN_PADDING + ICON_SIZE;
            this.textProps.y = this.backgroundProps.y + BTN_PADDING;
            this.textProps.w = this.textLayout.width;
        }
    }

    protected onRender(): any {
        this.backgroundProps.color = this.props.backgroundNormal ?? this.root?.theme.BUTTON_NORMAL ?? 0;

        this.backgroundView = createWidget(widget.FILL_RECT, this.backgroundProps);
        this.setupEventsAt(this.backgroundView);
        this.iconView = createWidget(widget.IMG, this.iconProps);
        this.setupEventsAt(this.iconView);

        if(SIZE_OPTION > 0) {
            this.textView = createWidget(widget.TEXT, this.textProps);
            this.setupEventsAt(this.textView);
        }
    }

    protected onDestroy(): any {
        if(SIZE_OPTION > 0) deleteWidget(this.textView);
        deleteWidget(this.iconView);
        deleteWidget(this.backgroundView);
    }

    protected onComponentUpdate() {
        if(this.backgroundView) this.backgroundView.setProperty(prop.MORE, this.backgroundProps);
        if(this.iconView) this.iconView.setProperty(prop.MORE, this.iconProps);
        if(this.textView) this.textView.setProperty(prop.MORE, this.textProps);
    }

    protected getAutoHeight(): number {
        return ICON_SIZE + BTN_PADDING * 4;
    }

    private refreshWidth() {
        if(SIZE_OPTION > 0) {
            this.textLayout.performUpdate(this.props.text, WIDGET_WIDTH, this.root.theme.FONT_SIZE - 4);
            this.backgroundProps.w = this.textLayout.width + ICON_SIZE + BTN_PADDING * 5;
        } else {
            this.backgroundProps.w = ICON_SIZE + BTN_PADDING * 2;
        }

        this.backgroundProps.x = (this.geometry.x ?? 0) + Math.floor(((this.geometry.w ?? 0) - this.backgroundProps.w) / 2);
    }

    onWheelClick(): boolean {
        if(this.props.onClick) {
            this.props.onClick();
            return true;
        }
        return false;
    }

    onTouchDown(data: ZeppWidgetEventData): boolean {
        this.backgroundProps.color = this.props.backgroundPressed ?? this.root.theme.BUTTON_PRESSED;
        if(this.backgroundView) this.backgroundView.setProperty(prop.MORE, this.backgroundProps);

        return super.onTouchDown(data);
    }

    onTouchMove(data: ZeppWidgetEventData): boolean {
        this.backgroundProps.color = this.props.backgroundNormal ?? this.root.theme.BUTTON_NORMAL;
        if(this.backgroundView) this.backgroundView.setProperty(prop.MORE, this.backgroundProps);

        return super.onTouchMove(data);
    }

    onTouchUp(data: ZeppWidgetEventData): boolean {
        this.backgroundProps.color = this.props.backgroundNormal ?? this.root?.theme.BUTTON_NORMAL ?? 0;
        if(this.backgroundView) this.backgroundView.setProperty(prop.MORE, this.backgroundProps);

        if(this.props.onClick) this.props.onClick();
        return super.onTouchUp(data);
    }

    onFocus() {
        this.backgroundProps.color = this.props.backgroundSelected ?? this.root?.theme.BUTTON_SELECTED ?? 0;
        if(this.backgroundView) this.backgroundView.setProperty(prop.MORE, this.backgroundProps);
    }

    onBlur() {
        this.backgroundProps.color = this.props.backgroundNormal ?? this.root?.theme.BUTTON_NORMAL ?? 0;
        if(this.backgroundView) this.backgroundView.setProperty(prop.MORE, this.backgroundProps);
    }
}
