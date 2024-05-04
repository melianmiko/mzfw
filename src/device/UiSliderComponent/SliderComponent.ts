import { Component } from "../UiComponent";
import { SliderComponentProps } from "./Types";
import { ZeppFillRectWidgetOptions, ZeppWidget, ZeppWidgetEventData } from "@zosx/types";
import { createWidget, deleteWidget, prop, widget } from "@zosx/ui";
import { BASE_FONT_SIZE } from "../UiProperties";

const DEFAULT_HEIGHT = BASE_FONT_SIZE * 2;

export class SliderComponent extends Component<SliderComponentProps> {
    public isFocusable: boolean = true;

    private nativeBackgroundProps: ZeppFillRectWidgetOptions = {x: 0, y: 0, w: 0, h: 0,};
    private nativeFillProps: ZeppFillRectWidgetOptions = {x: 0, y: 0, w: 0, h: 0,}

    private nativeBackground: ZeppWidget<ZeppFillRectWidgetOptions, {}> | null = null;
    private nativeFill: ZeppWidget<ZeppFillRectWidgetOptions, {}> | null = null;
    private clickBox: ZeppWidget<any, {}> | null = null;

    private isDesignLoaded: boolean = false;
    private fillColorNormal: number = 0;
    private fillColorSelected: number = 0;
    private fillColorActive: number = 0;
    private touchStart: ZeppWidgetEventData = {x: 0, y: 0};
    private wheelActive: boolean = false;

    private updateState(color: number, wheelActive?: boolean, noUpdate?: boolean) {
        if(this.nativeFillProps.color != color) {
            this.nativeFillProps.color = color;
            if(!noUpdate && this.nativeFill)
                this.nativeFill.setProperty(prop.MORE, this.nativeFillProps);
        }

        if(wheelActive != undefined)
            this.wheelActive = wheelActive;
    }

    onTouchDown(data: ZeppWidgetEventData): boolean {
        this.touchStart = data;
        this.updateState(this.fillColorNormal, false);
        return super.onTouchDown(data);
    }

    onTouchMove(data: ZeppWidgetEventData): boolean {
        this.root.setGestureLock(true);
        this.handleValueFromEvent(data);
        return super.onTouchMove(data);
    }

    onTouchUp(data: ZeppWidgetEventData): boolean {
        this.handleValueFromEvent(data, true);
        this.root.setGestureLock(false);
        return super.onTouchUp(data);
    }

    onFocus(_degree: number) {
        this.updateState(this.fillColorSelected, false);
    }

    onBlur() {
        this.updateState(this.fillColorNormal, false);
    }

    onWheelClick(): boolean {
        this.updateState(this.wheelActive ? this.fillColorSelected : this.fillColorActive, !this.wheelActive);
        return true;
    }

    onWheelSpin(_degree: number): boolean {
        if(!this.wheelActive)
            return super.onWheelSpin(_degree);

        const value = Math.max(this.props.minValue, Math.min(this.props.value + _degree, this.props.maxValue));
        this.handleValueChange(value);
        return true;
    }

    private handleValueFromEvent(data: ZeppWidgetEventData, noLimit?: boolean) {
        if(!noLimit && (
            Math.abs(this.touchStart.y - data.y) > 4
            || Math.abs(this.touchStart.x - data.x) < 2
        )) return;

        const value = (data.x - (this.geometry.x ?? 0)) / (this.geometry.w ?? 0);
        const outValue = this.props.minValue + Math.round((this.props.maxValue - this.props.minValue) * value);
        this.handleValueChange(outValue);
    }

    private handleValueChange(value: number) {
        this.props.value = value;
        this.props.onChange(value);

        // Update UI
        this.refreshWidth();
        if(this.nativeFill) this.nativeFill.setProperty(prop.MORE, this.nativeFillProps);
    }

    /**
     * Handle property change. For optimization, design props will be loaded only once.
     * @protected
     */
    protected onPropertiesChange() {
        if(!this.isDesignLoaded) {
            this.nativeBackgroundProps.color = this.props.backgroundColor ?? this.root.theme.BUTTON_NORMAL;
            this.nativeBackgroundProps.h = this.props.height ?? DEFAULT_HEIGHT;
            this.nativeBackgroundProps.radius = Math.floor(this.nativeBackgroundProps.h / 2) - 1;

            this.fillColorNormal = this.props.normalFillColor ?? this.root.theme.TEXT_COLOR;
            this.fillColorSelected = this.props.selectedFillColor ?? this.root.theme.ACCENT_COLOR_LIGHT;
            this.fillColorActive = this.props.activeFillColor ?? this.root.theme.ACCENT_COLOR;

            this.nativeFillProps.color = this.fillColorNormal;
            this.nativeFillProps.h = this.props.height ?? DEFAULT_HEIGHT;
            this.nativeFillProps.radius = Math.floor(this.nativeBackgroundProps.h / 2) - 1;

            this.isDesignLoaded = true;
        }

        this.refreshWidth();
    }

    /**
     * Handle geometry change: refresh all sizes
     * @protected
     */
    protected onGeometryChange() {
        const y = Math.max(0, Math.floor(((this.geometry.h ?? 0) - (this.props.height ?? DEFAULT_HEIGHT)) / 2));
        this.nativeBackgroundProps.x = this.geometry.x ?? 0;
        this.nativeBackgroundProps.y = (this.geometry.y ?? 0) + y;
        this.nativeBackgroundProps.w = this.geometry.w ?? 1;
        this.nativeFillProps.x = this.geometry.x ?? 0;
        this.nativeFillProps.y = (this.geometry.y ?? 0) + y;

        this.refreshWidth();
    }

    /**
     * Refresh width of fill view
     * @protected
     */
    protected refreshWidth() {
        const value = (this.props.value - this.props.minValue) / (this.props.maxValue - this.props.minValue);
        this.nativeFillProps.w = Math.round((this.geometry.w ?? 1) * Math.max(0, Math.min(value, 1)));
    }

    /**
     * Create all native views
     * @protected
     */
    protected onRender() {
        this.nativeBackground = createWidget<ZeppFillRectWidgetOptions>(widget.FILL_RECT, this.nativeBackgroundProps);
        this.nativeFill = createWidget<ZeppFillRectWidgetOptions>(widget.FILL_RECT, this.nativeFillProps);
        this.clickBox = createWidget<any>(widget.IMG, {...this.geometry, src: ""});
        this.setupEventsAt(this.clickBox);
    }

    /**
     * Update all native views
     * @protected
     */
    protected onComponentUpdate() {
        if(this.nativeBackground) this.nativeBackground.setProperty(prop.MORE, this.nativeBackgroundProps);
        if(this.nativeFill) this.nativeFill.setProperty(prop.MORE, this.nativeFillProps);
        if(this.clickBox) this.clickBox.setProperty(prop.MORE, this.geometry);
    }

    /**
     * Delete all native views
     * @protected
     */
    protected onDestroy() {
        deleteWidget(this.clickBox);
        deleteWidget(this.nativeFill);
        deleteWidget(this.nativeBackground);

        this.isDesignLoaded = false;
    }

    /**
     * Auto-height of this component is `inner height + 32`
     * @protected
     */
    protected getAutoHeight(): number {
        return (this.props.height ?? DEFAULT_HEIGHT) + 32;
    }
}
