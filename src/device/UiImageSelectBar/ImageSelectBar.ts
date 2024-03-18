import { Component } from "../UiComponent";
import { DEVICE_SHAPE } from "../UiProperties";
import { align, createWidget, deleteWidget, event, prop, widget } from "../../zosx/ui";
import { ZeppWidget, ZeppWidgetEventData } from "../../zosx/ui/Types";
import { ImageOptionBarItem, ImageOptionBarProps } from "./Types";
import { handleIconProperty } from "../UiTools";

const ICON_SIZE = DEVICE_SHAPE == "band" ? 64 : 80;
const ITEM_WIDTH = ICON_SIZE + 20;
const ROW_HEIGHT = ITEM_WIDTH + 40;

export class ImageSelectBar extends Component<ImageOptionBarProps> {
    isFocusable: boolean = true;

    private views: ImageOptionBarItem[] = [];
    private wheelFocusPosition: number = -1;

    protected getAutoHeight(): number {
        const itemsPerRow = Math.floor((this.geometry.w ?? 1) / ITEM_WIDTH);
        return Math.ceil(this.props.children.length / itemsPerRow) * ROW_HEIGHT;
    }

    protected onPropertiesChange() {
        for(let i = 0; i < this.props.children.length; i++) {
            // Default view native props
            if(!this.views[i]) this.views[i] = {
                backgroundProps: {
                    x: 0,
                    y: 0,
                    color: 0,
                    w: ICON_SIZE,
                    h: ICON_SIZE,
                },
                titleProps: {
                    x: 0,
                    y: 0,
                    align_h: align.CENTER_H,
                    text: "",
                    text_size: this.root.theme.FONT_SIZE - 8,
                    color: 0xFFFFFF,
                    h: this.root.theme.FONT_SIZE * 1.2,
                },
                iconProps: {
                    x: 0,
                    y: 0,
                    src: ""
                },
            }

            // Update native props
            this.views[i].iconProps.src = handleIconProperty(this.props.children[i].icon, ICON_SIZE);
            this.views[i].titleProps.text = this.props.children[i].title;
            this.views[i].backgroundProps.color = this.getItemBackgroundColor(i);
            this.views[i].titleProps.color = this.getItemBackgroundColor(i);
        }
    }

    protected onGeometryChange() {
        if(this.geometry.w == null || this.geometry.x == null || this.geometry.y == null)
            return;
        const maxItemsInRow = Math.floor(this.geometry.w / ITEM_WIDTH);
        const maxItemWidth = Math.floor(ITEM_WIDTH * 1.5);
        const rows = Math.ceil(this.props.children.length / maxItemsInRow);

        for(let row = 0; row < rows; row++) {
            const itemCount = Math.min(this.props.children.length - (row * maxItemsInRow), maxItemsInRow);
            const itemWidth = Math.min(maxItemWidth, Math.floor(this.geometry.w / itemCount));
            const offsetX = this.geometry.x + Math.floor((this.geometry.w - (itemWidth * itemCount)) / 2);

            for(let column = 0; column < itemCount; column++) {
                const i = row * maxItemsInRow + column;
                this.views[i].backgroundProps.x = offsetX + (column * itemWidth) +
                    Math.floor((itemWidth - ICON_SIZE) / 2);
                this.views[i].backgroundProps.y = this.geometry.y + (row * ROW_HEIGHT) + 8;
                this.views[i].iconProps.x = this.views[i].backgroundProps.x;
                this.views[i].iconProps.y = this.views[i].backgroundProps.y;
                this.views[i].titleProps.w = itemWidth;
                this.views[i].titleProps.x = offsetX + (column * itemWidth);
                this.views[i].titleProps.y = this.geometry.y + (row * ROW_HEIGHT) + ICON_SIZE + 16;
            }
        }
    }

    protected onRender() {
        for(let i = 0; i < this.views.length; i++) {
            const v = this.views[i];

            v.background = createWidget(widget.FILL_RECT, v.backgroundProps);
            this.setupEventsAt(v.background, i);
            v.title = createWidget(widget.TEXT, v.titleProps);
            this.setupEventsAt(v.title, i);
            v.icon = createWidget(widget.IMG, v.iconProps);
            this.setupEventsAt(v.icon, i);
        }
    }

    protected onDestroy() {
        for(const v of this.views) {
            deleteWidget(v.icon);
            deleteWidget(v.background);
            deleteWidget(v.title);
        }
    }

    protected onComponentUpdate() {
        // TODO: remove items from actionbar when they're removed props
        for(const v of this.views) {
            if(!v.background || !v.icon || !v.title) continue;
            v.background.setProperty(prop.MORE, v.backgroundProps);
            v.icon.setProperty(prop.MORE, v.iconProps);
            v.title.setProperty(prop.MORE, v.titleProps);
        }
    }

    private getItemBackgroundColor(i: number): number {
        const active = this.props.children[i].active;
        return active ? this.root.theme.ACCENT_COLOR : this.root.theme.TEXT_COLOR;
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
            index && this.props.children[index].onClick();
        })
    }

    onWheelSpin(degree: number): boolean {
        // const next = this.wheelFocusPosition + degree;
        const next = this.wheelFocusPosition += degree;

        if(next > -1 && next < this.views.length) {
            this.raiseViewFocus(next);
            return true;
        }

        return super.onWheelSpin(degree);
    }

    onWheelClick(): boolean {
        this.props.children[this.wheelFocusPosition]
         && this.props.children[this.wheelFocusPosition].onClick
         && this.props.children[this.wheelFocusPosition].onClick();

        return super.onWheelClick();
    }

    private raiseViewFocus(next: number): void {
        const prev = this.wheelFocusPosition;
        this.wheelFocusPosition = next;

        if(prev > -1) {
            this.views[prev].backgroundProps.color = this.getItemBackgroundColor(prev);
            this.views[prev].titleProps.color = this.getItemBackgroundColor(prev);
            const v = this.views[prev].background;
            if(v) v.setProperty(prop.MORE, this.views[prev].backgroundProps);
        }

        if(next > -1) {
            this.views[next].backgroundProps.color = this.getItemBackgroundColor(next);
            this.views[next].titleProps.color = this.getItemBackgroundColor(next);
            const v = this.views[next].background;
            if(v) v.setProperty(prop.MORE, this.views[next].backgroundProps);
        }
    }
}
