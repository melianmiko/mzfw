import { BaseCompositor, Component } from "../UiComponent";
import {
    BOTTOM_MARGIN,
    DeviceInfo,
    ensureIsNotLegacyDevice,
    HAVE_STATUS_BAR,
    SCREEN_HEIGHT,
    SCREEN_MARGIN,
    STATUS_BAR_HEIGHT,
    TOP_MARGIN,
    WIDGET_WIDTH
} from "../UiProperties";
import { isLegacyDevice } from "../System";
import { performVibration } from "../System/Vibrator";
import { ChildPositionInfo } from "./Types";
import { DummyComponent } from "../UiComponent/DummyComponent";
import { createSpinner } from "../UiTools";
import { createWidget, prop, redraw, widget } from "@zosx/ui";
import { ZeppImgWidgetOptions, ZeppWidget } from "@zosx/types";
import { getScrollTop, scrollTo } from "@zosx/page";

const REV_RENDER_START_POS = 10000;

export class ListView<T> extends BaseCompositor<T> {
    private eofListView: ZeppWidget<ZeppImgWidgetOptions, {}> | null = null;
    private listChildComponents: ChildPositionInfo[] = [];
    private renderStartPos: number = 0;
    private renderEndPos: number = 0;
    private footerComponent: Component<any> | null = null;
    private buildMorePage: number = 0;
    private lastDynRenderRefreshScrollPosition: number = 0;
    protected dynamicRenderEnabled: boolean = false;
    protected listViewTopOffset: number = 0;
    protected overrideHeaderHeight: number | null = null;

    /**
     * Will create ListScreen from only one present build() function
     * @param buildFunc build() => Component<any>[];
     */
    static makeSimplePage(buildFunc: (params: any) => Component<any>[]) {
        let page: any;
        return {
            onInit(p: string) {
                let props: any = {};
                try {
                    props = JSON.parse(p);
                } catch (e) {}

                page = new ListView(props);
                page.build = () => {
                    return buildFunc(props);
                };
                page.performRender();
            },
            onDestroy() {
                page.performDestroy();
            }
        };
    }

    /**
     * Render all attached components
     */
    performRender() {
        super.performRender();
        this.beforeListViewRender();
        this.renderListView();
        this.onBuild();
    }

    protected beforeListViewRender() {}

    protected onBuild() {}

    private renderListView() {
        if(this.dynamicRenderEnabled && isLegacyDevice) {
            console.log("WARN: Force disable dynamic render: ZeppOS 1.0.x device");
            this.dynamicRenderEnabled = false;
        }

        this.renderStartPos = this.renderDirection == 1 ? this.listViewTopOffset : REV_RENDER_START_POS;
        this.renderEndPos = this.renderStartPos;

        // Create end-of list view for dynamic rendering
        if(!this.eofListView)
            this.eofListView = createWidget<ZeppImgWidgetOptions>(widget.IMG, {
                x: 0,
                y: this.renderStartPos,
                w: 10,
                h: 1,
                src: "",
            });

        const header = this.buildHeader();
        const margin = this.overrideHeaderHeight ?? (this.renderDirection == 1 ? TOP_MARGIN : BOTTOM_MARGIN);
        if(header) {
            if(HAVE_STATUS_BAR && !this.hideStatusBar && this.renderDirection == 1) {
                // Keep status bar visible, so add offset
                this.addComponent(new DummyComponent({height: STATUS_BAR_HEIGHT}), 0, STATUS_BAR_HEIGHT);
                this.addComponent(header, 1, null);
            } else {
                // Add only header w-o status bar height reserve
                this.addComponent(header, 0, margin);
            }
        } else {
            // Add placeholder to keep header space reserved
            this.addComponent(new DummyComponent({height: margin}), 0, margin);
        }

        for(const component of this.build())
            if(component != null)
                this.addComponent(component);

        if(this.renderDirection == -1)
            scrollTo({y: -REV_RENDER_START_POS + SCREEN_HEIGHT});
    }

    /**
     * Rebuild entire screen (this is VERY SLOW, use only if you really need this)
     */
    rebuildAll() {
        ensureIsNotLegacyDevice();

        for(const child of this.listChildComponents) {
            child.component.performDestroy();
        }

        this.focusPosition = -1;
        this.nestedComponents = [];
        this.listChildComponents = [];

        this.renderListView();
    }

    /**
     * Dynamically add component to end of stack.
     *
     * @param component Component to add
     * @param at Target index position
     * @param height
     */
    addComponent(component: Component<any>, at: number = this.listChildComponents.length, height: number | null = null) {
        if(!this.isRendered)
            return;

        component.attachParent(this);
        component.setGeometry(null, null, WIDGET_WIDTH, height);

        if(at == this.listChildComponents.length) {
            this.nestedComponents.push(component);
            this.listChildComponents.push({component, y: 0, lastHeight: 0});
            this.repositionComponents(at, this.renderEndPos);
        } else {
            this.injectComponentToPosition(component, at);
            this.onChildHeightChanged();
        }

        if(this.dynamicRenderEnabled) {
            this.dynamicRender(this.listChildComponents.length - 1);
        } else {
            component.performRender();
        }
    }

    /**
     * Will insert component to provided position. Used inside addComponent only.
     *
     * @param component Component to be placed in
     * @param at Target position
     * @private
     */
    private injectComponentToPosition(component: Component<any>, at: number) {
        this.nestedComponents = [
            ...this.nestedComponents.slice(0, at),
            component,
            ...this.nestedComponents.slice(at),
        ];
        this.listChildComponents = [
            ...this.listChildComponents.slice(0, at),
            {component, lastHeight: -1, y: -1},
            ...this.listChildComponents.slice(at),
        ]
    }

    /**
     * Dynamically remove component.
     *
     * @param component Component to remove
     */
    removeComponent(component: Component<any>) {
        for(let i = 0; i < this.listChildComponents.length; i++)
            if(this.listChildComponents[i].component == component)
                return this.removeComponentAt(i);
    }

    /**
     * Remove component at defined position
     *
     * @param index Component position
     * @private
     */
    private removeComponentAt(index: number) {
        const child = this.listChildComponents[index];
        child.component.performDestroy();

        this.nestedComponents = this.nestedComponents.filter((c) => c != child.component);
        this.listChildComponents = this.listChildComponents.filter((_ , i) => i != index);

        // Re-position all items bellow current
        const y = index == 0 ? this.renderStartPos :
            this.listChildComponents[index - 1].y + this.listChildComponents[index - 1].lastHeight;
        this.repositionComponents(index, y);

        // If focus position is equal to removed item, we should set it to next one
        if(this.focusPosition == index) {
            const cmp = this.listChildComponents[index].component;
            cmp.onFocus && cmp.onFocus(1);
            this.scrollToFocusedChild();
        }
    }

    /**
     * Will check which component is resized and re-arrange all components bellow of them.
     */
    onChildHeightChanged(): void {
        let y = this.renderStartPos;

        // Detect changed component
        let i: number;
        for(i = 0 ; i < this.listChildComponents.length; i++) {
            if(this.listChildComponents[i].component.geometry.h != this.listChildComponents[i].lastHeight)
                break;

            y += this.renderDirection * this.listChildComponents[i].lastHeight;
        }

        this.repositionComponents();
    }

    /**
     * Will re-align all components from provided index and provided y offset
     *
     * @param i Component re-align begin index
     * @param y Component re-align position
     * @private
     */
    private repositionComponents(i: number = 0, y: number = this.renderStartPos) {
        for(; i < this.listChildComponents.length; i++) {
            const cmp = this.listChildComponents[i].component;
            const height = cmp.geometry.h ?? 0;
            cmp.setGeometry(
                SCREEN_MARGIN,
                this.renderDirection == 1 ? y : y - height
            );
            this.listChildComponents[i] = {
                component: cmp,
                y: y,
                lastHeight: height,
            };

            y += this.renderDirection * height;
        }

        // re-position focus
        if(this.focusPosition > -1)
            this.scrollToFocusedChild();

        // re-position footer
        if(this.footerComponent != null && this.renderEndPos != y)
            this.footerComponent.setGeometry(
                SCREEN_MARGIN,
                y - (this.renderDirection < 0 ? BOTTOM_MARGIN : 0)
            );

        // re-position eof-list view
        if(this.renderDirection == 1 && this.renderEndPos != y && this.eofListView) {
            this.eofListView.setProperty(prop.Y, y + BOTTOM_MARGIN);
        }

        // Limit scroll to top
        if(this.renderDirection == -1)
            this.minScrollPosition = y - SCREEN_HEIGHT * 1.5;

        this.renderEndPos = y;
    }

    /**
     * This method is called every 50-100 ms, it will perform all scroll-desired operation
     * @protected
     */
    protected onInternalTimerTick(): number {
        const scrollPosition = super.onInternalTimerTick();

        if(this.isRendered && this.dynamicRenderEnabled &&
            Math.abs(scrollPosition - this.lastDynRenderRefreshScrollPosition) > 100) {
            this.dynamicRender();
            this.lastDynRenderRefreshScrollPosition = scrollPosition;
        }

        if(this.isRendered && this.footerComponent == null) {
            if((this.renderDirection == 1 && this.renderEndPos - scrollPosition - SCREEN_HEIGHT <= 200) ||
                (this.renderDirection == -1 && scrollPosition - this.renderEndPos <= 200))
            this.performBuildMore();
        }

        return scrollPosition;
    }

    /**
     * Will be called when user scroll reaches footer.
     * This method will try to call buildMore() to get more items for page.
     *
     * @private
     */
    private performBuildMore() {
        // console.log(`Render more, page=${this.buildMorePage}`);

        // Use spinner as footer
        const spinner = this.buildSpinner();
        this.footerComponent = spinner
        this.performRenderFooter();

        // Call to buildMore
        this.buildMore(this.buildMorePage).then((components) => {
            spinner.performDestroy();
            redraw && redraw();

            if(components.length == 0) {
                // console.log("No more items, redirect to generic footer...");
                this.footerComponent = this.buildFooter();
                this.performRenderFooter();
                return;
            }

            for(const component of components)
                if(component != null)
                    this.addComponent(component);

            this.buildMorePage++;
            this.footerComponent = null;
        })
    }

    /**
     * This method will configure footer component
     * @private
     */
    private performRenderFooter() {
        if(this.footerComponent == null || !this.isRendered)
            return;
        this.footerComponent.attachParent(this);
        this.footerComponent.setGeometry(
            SCREEN_MARGIN,
            this.renderEndPos - (this.renderDirection < 0 ? BOTTOM_MARGIN : 0),
            WIDGET_WIDTH,
            BOTTOM_MARGIN
        )
        this.footerComponent.performRender();
    }

    /**
     * WIll recover scroll position, no more
     */
    recoverFocusPosition(): number {
        const targetY = Math.floor(-getScrollTop() + (SCREEN_HEIGHT / 2));
        if(this.renderDirection == 1) {
            // From first to last
            for(let i = 0; i < this.listChildComponents.length && i >= 0; i++) {
                if(this.listChildComponents[i].y + this.listChildComponents[i].lastHeight >= targetY)
                    return i;
            }
        } else {
            // From last to first
            for(let i = this.listChildComponents.length - 1; i >= 0; i--) {
                if(this.listChildComponents[i].y >= targetY)
                    return i;
            }
        }

        // Focus to first controlled component
        return this.nestedComponents.length - this.listChildComponents.length;
    }

    /**
     * This function will check, which components should be rendered or destroyed in current scroll position.
     * That's a part of dynamic render.
     *
     * @param startIndex Component review start index
     * @param endIndex Component review end index
     * @private
     */
    private dynamicRender(startIndex: number = 0, endIndex: number = this.listChildComponents.length) {
        const scrollPos = -getScrollTop();
        const topBaseLine = Math.max(0, scrollPos - SCREEN_HEIGHT);
        const bottomBaseLine = scrollPos + 2 * SCREEN_HEIGHT;
        // console.log(topBaseLine, bottomBaseLine);

        // let debug = "";
        for(let i = startIndex; i < endIndex; i++) {
            const visible = this.listChildComponents[i].y >= topBaseLine && this.listChildComponents[i].y <= bottomBaseLine
            // debug += visible ? "1" : "0";
            if(!visible && this.listChildComponents[i].component.isRendered) {
                this.listChildComponents[i].component.performDestroy();
            } else if(visible && !this.listChildComponents[i].component.isRendered) {
                this.listChildComponents[i].component.performRender();
            }
        }
        // console.log(debug);
    }

    /**
     * Will vibrate on component focus reach & scroll to them
     *
     * @protected
     */
    protected onWheelFocusChange(degree: number) {
        super.onWheelFocusChange(degree);

        performVibration(23, 25);
        this.scrollToFocusedChild();
    }

    /**
     * Will scroll to newly focused child.
     * @protected
     */
    protected scrollToFocusedChild() {
        const {y, h} = this.nestedComponents[this.focusPosition].geometry;
        this.smoothScrollPosition = (y ?? 0) - (DeviceInfo.height - (h ?? 0)) / 2;
    }

    /**
     * Should return set of components that will be rendered on page start.
     */
    protected build() : ( Component<any> | null )[] {
        return [];
    }

    /**
     * Should return more dynamically-loaded components if available.
     * Or empty array if no more was present.
     *
     * @param page Current page number
     */
    protected buildMore(page: number): Promise<Component<any>[]> {
        console.log(`buildMore() non-exists, page=${page}`);
        return Promise.resolve([]);
    }

    /**
     * Should create header component, that will be rendered at position zero
     * with fixed (device-specific) height.
     */
    protected buildHeader(): Component<any> | null {
        return null;
    }

    /**
     * Should create footer component, that will be drawn on page end, when
     * noting more present in buildMore() and build()
     */
    protected buildFooter(): Component<any> {
        return new DummyComponent({height: BOTTOM_MARGIN});
    }

    /**
     * Should create loading footer for buildMore()
     */
    protected buildSpinner(): Component<any> {
        return createSpinner();
    }

    /**
     * Unused
     */
    protected getAutoHeight(): number {
        return SCREEN_HEIGHT;
    }
}
