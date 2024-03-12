import { Component } from "../UiComponent";
import { KEY_EVENT_PRESS, KEY_EVENT_RELEASE } from "../../zosx/interaction";
import { IS_SMALL_SCREEN_DEVICE, IS_MI_BAND_7 } from "../UiProperties";
import { ZeppGroupInstance, ZeppWidget, ZeppWidgetEventData } from "../../zosx/ui/Types";
import { ZeppFillRectWidgetOptions, ZeppWidgetPositionOptions } from "../../zosx/ui/WidgetOptionTypes";
import { createWidget, deleteWidget, prop, widget } from "../../zosx/ui";

const SECOND_BUTTON_WIDTH = IS_SMALL_SCREEN_DEVICE ? 90 : 120;

export type PaperWidgetProps = {
    paperRadius?: number,
    secondActionName?: string,
    onSecondActionClick?(): any,
    paperBackgroundNormal?: number,
    paperBackgroundSelected?: number,
    paperBackgroundPressed?: number,
    paperBackgroundMarginV?: number,
    paperBackgroundMarginH?: number,
}

// TODO: Refactor
export abstract class PaperComponent<T> extends Component<PaperWidgetProps & T> {
    public isFocusable: boolean = true;

    protected button: ZeppWidget<any, {}> | null = null;
    protected group: ZeppWidget<ZeppWidgetPositionOptions, ZeppGroupInstance> | null = null;
    protected paperBackground: ZeppWidget<ZeppFillRectWidgetOptions, {}> | null = null;

    private color: number = 0;
    private pressedSince: number = 0;
    private clickData: ZeppWidgetEventData | null = null;

    private longTouchTimer: NodeJS.Timeout | null = null;
    private swipeCancelTimer: NodeJS.Timeout | null = null;

    private isFocused: boolean = false;
    private isWheelDown: boolean = false;

    private colorNormal: number = 0;
    private colorSelected: number = 0;
    private colorPressed: number = 0;

    protected onPropertiesChange() {
        const theme = this.root?.theme;
        this.colorNormal = this.props.paperBackgroundNormal ?? theme?.PAPER_NORMAL ?? 0;
        this.colorSelected = this.props.paperBackgroundSelected ?? theme?.PAPER_SELECTED ?? 0;
        this.colorPressed = this.props.paperBackgroundPressed ?? theme?.PAPER_PRESSED ?? 0;
    }

    onRender() {
        this.color = this.colorNormal;

        if(this.props.secondActionName)
            this.button = createWidget(widget.BUTTON, this.buttonProps);

        this.group = createWidget<ZeppWidgetPositionOptions, ZeppGroupInstance>(widget.GROUP, {
            x: this.geometry.x ?? 0,
            y: this.geometry.y ?? 0,
            w: this.geometry.w ?? 0,
            h: this.geometry.h ?? 0,
        });
        this.paperBackground = this.group.createWidget<ZeppFillRectWidgetOptions>(widget.FILL_RECT, this.paperBackgroundProps);
        this.setupEventsAt(this.paperBackground);
    }

    onDestroy() {
        if(this.longTouchTimer)
            clearTimeout(this.longTouchTimer);
        if(this.swipeCancelTimer)
            clearTimeout(this.swipeCancelTimer);

        this.longTouchTimer = null;
        this.swipeCancelTimer = null;

        deleteWidget(this.paperBackground);
        deleteWidget(this.group);
        if(this.button) deleteWidget(this.button);
    }

    abstract onClick(data: ZeppWidgetEventData): any;

    private onClickStart(data: ZeppWidgetEventData, isWheelClick: boolean = false) {
        if(this.pressedSince > 0) return;

        // UI
        this.setColor(this.colorPressed);

        // Logical handler
        this.pressedSince = Date.now();
        this.clickData = data;

        // Timer
        let tick = 0;
        this.longTouchTimer = setInterval(() => {
            if(tick == 1 && isWheelClick)
                this.onLongWheelClick();
            else if(tick >= 3) {
                this.onClickCancel(true);
            }
            tick++;
        }, 350);
    }

    private onLongWheelClick() {
        if(this.props.onSecondActionClick)
            this.props.onSecondActionClick();
        this.onClickCancel(true);
    }

    private onClickCancel(failure: boolean = false) {
        if(this.pressedSince == 0) return;

        this.setColor(this.isFocused ? this.colorSelected : this.colorNormal);

        if(!failure && Date.now() - this.pressedSince < 350 && this.clickData) {
            this.onClick(this.clickData);
        }
        this.pressedSince = 0;

        if(this.longTouchTimer) {
            clearInterval(this.longTouchTimer);
            this.longTouchTimer = null;
        }
    }

    onWheelButtonEvent(action: number): boolean {
        switch(action) {
            case KEY_EVENT_PRESS:
                if(!this.isWheelDown)
                    this.onClickStart({x: -1, y: -1}, true);
                this.isWheelDown = true;
                return true;
            case KEY_EVENT_RELEASE:
                if(this.isWheelDown)
                    this.onClickCancel();
                this.isWheelDown = false;
                return true;
        }

        return false;
    }

    onTouchDown(data: ZeppWidgetEventData): boolean {
        this.onClickStart(data);
        return super.onTouchDown(data);
    }

    onTouchUp(data: ZeppWidgetEventData): boolean {
        this.onClickCancel();
        return super.onTouchUp(data);
    }

    onTouchMove(data: ZeppWidgetEventData): boolean {
        if(!this.clickData) return super.onTouchMove(data);

        const dx = data.x - this.clickData.x;
        const dy = data.y - this.clickData.y;

        if(this.pressedSince > 0 && Math.abs(dx + dy) > 8)
            this.onClickCancel(true);
        if(this.props.secondActionName)
            this.onSwipeMove(dx);

        return super.onTouchMove(data);
    }

    private onSwipeMove(dx: number) {
        dx = Math.min(Math.max(-SECOND_BUTTON_WIDTH, dx), 0);

        if(this.swipeCancelTimer)
            clearTimeout(this.swipeCancelTimer)
        if(dx < 0)
            this.swipeCancelTimer = setTimeout(() => this.onSwipeCancel(), 2500);

        if(this.group)
            this.group.setProperty(prop.X, (this.geometry.x ?? 0) + dx);
    }

    private onSwipeCancel() {
        this.onSwipeMove(0);
        this.swipeCancelTimer = null;
    }

    onFocus() {
        this.isFocused = true;
        this.setColor(this.colorSelected);
    }

    onBlur() {
        this.isFocused = false;
        this.setColor(this.colorNormal);
    }

    protected onComponentUpdate() {
        if(this.paperBackground)
            this.paperBackground.setProperty(prop.MORE, this.paperBackgroundProps);
        if(this.group)
            this.group.setProperty(prop.MORE, this.geometry);
        if(this.button)
            this.button.setProperty(prop.MORE, this.buttonProps);
    }

    private setColor(color: number) {
        this.color = color;
        if(this.paperBackground)
            this.paperBackground.setProperty(prop.MORE, this.paperBackgroundProps as any);
    }

    private get paperBackgroundProps(): ZeppFillRectWidgetOptions {
        const marginH = this.props.paperBackgroundMarginH ?? 0;
        const marginV = this.props.paperBackgroundMarginV ?? 0;

        return {
            x: marginH,
            y: marginV,
            w: (this.geometry.w ?? 0) - marginH * 2,
            h: (this.geometry.h ?? 0) - marginV * 2,
            color: this.color,
            radius: typeof this.props.paperRadius == "number" ? this.props.paperRadius : 8,
        }
    }

    private get buttonProps(): any {
        if(!this.root) return {};
        const geometry = {
            x: this.geometry.x ?? 0,
            y: this.geometry.y ?? 0,
            w: this.geometry.w ?? 0,
            h: this.geometry.h ?? 0,
        }
        const marginH = (this.props.paperBackgroundMarginH ?? 0) + 1;
        const marginV = (this.props.paperBackgroundMarginV ?? 0) + 1;

        return {
            x: geometry.x + geometry.w - SECOND_BUTTON_WIDTH + marginH,
            y: geometry.y + marginV,
            w: SECOND_BUTTON_WIDTH - (marginH * 2),
            h: geometry.h - (marginV * 2),
            normal_color: this.root.theme.ACCENT_COLOR_DARK,
            press_color: this.root.theme.ACCENT_COLOR_DARK,
            color: this.root.theme.ACCENT_COLOR,
            text: this.props.secondActionName,
            text_size: this.root.theme.FONT_SIZE - 4,
            radius: typeof this.props.paperRadius == "number" ? this.props.paperRadius : 8,
            click_func: this.props.onSecondActionClick,
        }
    }
}
