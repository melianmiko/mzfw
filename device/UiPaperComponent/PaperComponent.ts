import {Component, TouchEventData} from "../UiComponent";
import {IHmUIWidget, IHmUIWidgetOptions, IZeppGroupWidgetOptions, systemUi} from "../System";
import {KEY_EVENT_PRESS, KEY_EVENT_RELEASE} from "../System/Interaction";

const SECOND_BUTTON_WIDTH = 120;

export type PaperWidgetProps = {
    paperRadius?: number,
    secondActionName?: string,
    onSecondActionClick?(): any,
    paperBackgroundMarginV?: number,
    paperBackgroundMarginH?: number,
}

export abstract class PaperComponent<T> extends Component<PaperWidgetProps & T> {
    public isFocusable: boolean = true;

    protected colorDefault = 0x0;
    protected colorSelected = 0x333333;
    protected colorPressed = 0x444444;
    protected button: IHmUIWidget;
    protected group: IZeppGroupWidgetOptions;
    protected paperBackground: IHmUIWidget;

    private color: number = this.colorDefault;
    private longTouchTimer: number = -1;
    private pressedSince: number = 0;
    private clickData: TouchEventData;

    private isFocused: boolean = false;
    private isWheelDown: boolean = false;
    private swipeCancelTimer: number = 0;

    onRender() {
        this.color = this.colorDefault;

        if(this.props.secondActionName)
            this.button = systemUi.createWidget(systemUi.widget.BUTTON, this.buttonProps as any);
        this.group = systemUi.createWidget(systemUi.widget.GROUP, this.geometry as any) as IZeppGroupWidgetOptions;
        this.paperBackground = this.group.createWidget(systemUi.widget.FILL_RECT, this.paperBackgroundProps);
        this.setupEventsAt(this.paperBackground);
    }

    onDestroy() {
        if(this.longTouchTimer)
            clearTimeout(this.longTouchTimer);
        if(this.swipeCancelTimer)
            clearTimeout(this.swipeCancelTimer);

        this.longTouchTimer = null;
        this.swipeCancelTimer = null;

        systemUi.deleteWidget(this.paperBackground);
        systemUi.deleteWidget(this.group);
        if(this.button)
            systemUi.deleteWidget(this.button);
    }

    abstract onClick(data: TouchEventData): any;

    private onClickStart(data: TouchEventData, isWheelClick: boolean = false) {
        if(this.pressedSince > 0) return;

        // UI
        this.setColor(this.colorPressed);

        // Logical handler
        this.pressedSince = Date.now();
        this.clickData = data;
        if(isWheelClick)
            this.longTouchTimer = setTimeout(() => this.onLongWheelClick(), 350);
    }

    private onLongWheelClick() {
        this.props.onSecondActionClick();
        this.onClickCancel(true);
    }

    private onClickCancel(failure: boolean = false) {
        if(this.pressedSince == 0) return;

        this.setColor(this.isFocused ? this.colorSelected : this.colorDefault);

        if(!failure && Date.now() - this.pressedSince < 350) {
            this.onClick(this.clickData);
        }
        this.pressedSince = 0;

        if(this.longTouchTimer) {
            clearTimeout(this.longTouchTimer);
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

    onTouchDown(data: TouchEventData): boolean {
        this.onClickStart(data);
        return super.onTouchDown(data);
    }

    onTouchUp(data: TouchEventData): boolean {
        this.onClickCancel();
        return super.onTouchUp(data);
    }

    onTouchMove(data: TouchEventData): boolean {
        if(!this.clickData) return;

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

        this.group.setProperty(systemUi.prop.X, this.geometry.x + dx);
    }

    private onSwipeCancel() {
        this.onSwipeMove(0);
        this.swipeCancelTimer = 0;
    }

    onFocus() {
        this.isFocused = true;
        this.setColor(this.colorSelected);
    }

    onBlur() {
        this.isFocused = false;
        this.setColor(this.colorDefault);
    }

    protected onComponentUpdate() {
        this.paperBackground.setProperty(systemUi.prop.MORE, this.paperBackgroundProps as any);
        this.group.setProperty(systemUi.prop.MORE, this.geometry as any);
        if(this.button)
            this.button.setProperty(systemUi.prop.MORE, this.buttonProps as any);
    }

    private setColor(color: number) {
        this.color = color;
        this.paperBackground.setProperty(systemUi.prop.MORE, this.paperBackgroundProps as any);
    }

    private get paperBackgroundProps(): IHmUIWidgetOptions {
        const marginH = this.props.paperBackgroundMarginH ?? 0;
        const marginV = this.props.paperBackgroundMarginV ?? 0;

        return {
            x: marginH,
            y: marginV,
            w: this.geometry.w - marginH * 2,
            h: this.geometry.h - marginV * 2,
            color: this.color,
            radius: this.props.paperRadius ? this.props.paperRadius : 8,
        }
    }

    private get buttonProps(): any {
        return {
            x: this.geometry.x + this.geometry.w - SECOND_BUTTON_WIDTH,
            y: this.geometry.y,
            w: SECOND_BUTTON_WIDTH,
            h: this.geometry.h,
            normal_color: this.root.theme.ACCENT_COLOR_DARK,
            press_color: this.root.theme.ACCENT_COLOR_DARK,
            color: this.root.theme.ACCENT_COLOR,
            text: this.props.secondActionName,
            text_size: this.root.theme.FONT_SIZE - 4,
            radius: 4,
            click_func: this.props.onSecondActionClick,
        }
    }
}
