import { Component } from "../UiComponent";
import { ActionBarItem, ActionBarItemView } from "./Types";
import { ICON_SIZE } from "../UiProperties";
import { createWidget, deleteWidget, event, prop, widget } from "../../zosx/ui";
import { ZeppWidget, ZeppWidgetEventData } from "../../zosx/ui/Types";

const ACTION_ICON_SIZE = Math.max(32, ICON_SIZE);
const ACTION_ITEM_SIZE = ACTION_ICON_SIZE * 2;
const ROW_HEIGHT = ACTION_ITEM_SIZE + 8;
const ITEM_ICON_MARGIN = Math.floor((ACTION_ITEM_SIZE - 4 - ACTION_ICON_SIZE) / 2);

export class ActionBar extends Component<ActionBarItem[]> {
    isFocusable: boolean = true;

    private views: ActionBarItemView[] = [];
    private wheelFocusPosition: number = -1;

    protected getAutoHeight(): number {
        const itemsPerRow = Math.floor((this.geometry.w ?? 1) / ACTION_ITEM_SIZE);
        return Math.ceil(this.props.length / itemsPerRow) * ROW_HEIGHT;
    }

    protected onPropertiesChange() {
        for(let i = 0; i < this.props.length; i++) {
            // Default view native props
            if(!this.views[i]) this.views[i] = {
                backgroundProps: {
                    x: 0,
                    y: 0,
                    color: 0x222222,
                    w: ACTION_ITEM_SIZE - 4,
                    h: ACTION_ITEM_SIZE - 4,
                    radius: Math.floor(ACTION_ITEM_SIZE / 2) - 1,
                },
                iconProps: {
                    x: 0,
                    y: 0,
                    src: ""
                },
            }

            // Update native props
            this.views[i].iconProps.src = `icon/${ACTION_ICON_SIZE}/${this.props[i].icon}.png`
            this.views[i].iconProps.alpha = this.props[i].disabled ? 120 : 255;
            this.views[i].backgroundProps.color = this.getItemBackgroundColor(i);
        }
    }

    protected onGeometryChange() {
        if(this.geometry.w == null || this.geometry.x == null || this.geometry.y == null)
            return;
        const maxItemsInRow = Math.floor(this.geometry.w / ACTION_ITEM_SIZE);
        const maxItemWidth = Math.floor(ACTION_ITEM_SIZE * 1.5);
        const rows = Math.ceil(this.props.length / maxItemsInRow);

        for(let row = 0; row < rows; row++) {
            const count = Math.min(this.props.length - (row * maxItemsInRow), maxItemsInRow);
            const itemWidth = Math.min(maxItemWidth, Math.floor(this.geometry.w / count));
            const offsetX = this.geometry.x + Math.floor((this.geometry.w - (itemWidth * count)) / 2);

            for(let column = 0; column < count; column++) {
                const i = row * maxItemsInRow + column;
                this.views[i].backgroundProps.x = offsetX + (column * itemWidth) +
                    Math.floor((itemWidth - ACTION_ITEM_SIZE) / 2) + 2;
                this.views[i].backgroundProps.y = this.geometry.y + (row * ROW_HEIGHT) + 2;
                this.views[i].iconProps.x = this.views[i].backgroundProps.x + ITEM_ICON_MARGIN;
                this.views[i].iconProps.y = this.views[i].backgroundProps.y + ITEM_ICON_MARGIN;
            }
        }
    }

    protected onRender() {
        for(let i = 0; i < this.views.length; i++) {
            const v = this.views[i];

            v.background = createWidget(widget.FILL_RECT, v.backgroundProps);
            this.setupEventsAt(v.background, i);
            v.icon = createWidget(widget.IMG, v.iconProps);
            this.setupEventsAt(v.icon, i);
        }
    }

    protected onDestroy() {
        for(const v of this.views) {
            deleteWidget(v.icon);
            deleteWidget(v.background);
        }
    }

    protected onComponentUpdate() {
        // TODO: remove items from actionbar when they're removed props
        for(const v of this.views) {
            if(!v.background || !v.icon) continue;
            v.background.setProperty(prop.MORE, v.backgroundProps as any);
            v.icon.setProperty(prop.MORE, v.iconProps as any);
        }
    }

    private getItemBackgroundColor(i: number): number {
        if(this.props[i].disabled) return 0x111111;
        if(this.wheelFocusPosition == i) return 0x444444;
        return 0x222222;
    }

    onFocus(degree: number) {
        this.raiseViewFocus(degree > 0 ? 0 : this.views.length - 1);
    }

    onBlur() {
        this.raiseViewFocus(-1);
    }

    protected setupEventsAt(nativeWidget: ZeppWidget<any, any>, index?: number) {
        super.setupEventsAt(nativeWidget);
        nativeWidget.addEventListener(event.CLICK_UP, (p :ZeppWidgetEventData) => {
            this.onTouchUp(p);
            index && this.props[index].onClick();
        })
    }

    onWheelSpin(degree: number): boolean {
        // const next = this.wheelFocusPosition + degree;
        let next = this.wheelFocusPosition;
        do {
            next += degree
        } while (this.views[next] && this.props[next].disabled);

        if(next > -1 && next < this.views.length) {
            this.raiseViewFocus(next);
            return true;
        }

        return super.onWheelSpin(degree);
    }

    onWheelClick(): boolean {
        this.props[this.wheelFocusPosition] && this.props[this.wheelFocusPosition].onClick &&
            this.props[this.wheelFocusPosition].onClick();
        return super.onWheelClick();
    }

    private raiseViewFocus(next: number): void {
        const prev = this.wheelFocusPosition;
        this.wheelFocusPosition = next;

        if(prev > -1) {
            this.views[prev].backgroundProps.color = this.getItemBackgroundColor(prev);
            const v = this.views[prev].background;
            if(v) v.setProperty(prop.MORE, this.views[prev].backgroundProps);
        }

        if(next > -1) {
            this.views[next].backgroundProps.color = this.getItemBackgroundColor(next);
            const v = this.views[next].background;
            if(v) v.setProperty(prop.MORE, this.views[next].backgroundProps);
        }
    }
}
