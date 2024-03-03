import {Component, RootComponent} from "../UiComponent";
import {
    BOTTOM_MARGIN,
    DeviceInfo,
    IS_BAND_7,
    SCREEN_HEIGHT,
    SCREEN_MARGIN,
    TOP_MARGIN,
    WIDGET_WIDTH
} from "../UiProperties";
import {UiDrawRectangleComponent} from "../UiDrawComponent";
import {AnimComponent} from "../UiAnimComponent";
import {IHmUIWidget, systemUi} from "../System";
import {performVibration} from "../System/Vibrator";
import * as PageTools from "../System/PageTools";
import {ChildPositionInfo} from "./Types";

const REV_RENDER_START_POS = 10000;

export class ListView<T> extends RootComponent<T> {
    private eofListView: IHmUIWidget;
    private childPositionInfo: ChildPositionInfo[] = [];
    private renderStartPos: number = null;
    private renderEndPos: number = null;
    private footerComponent: Component<any> | null = null;
    private buildMorePage: number = 0;
    private lastDynRenderRefreshScrollPosition: number = 0;
    protected dynamicRenderEnabled: boolean = false;

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
                }
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
    onRender() {
        if(this.dynamicRenderEnabled && IS_BAND_7) {
            console.log("WARN: Force disable dynamic render for Band 7 due to: Bad ZeppOS version");
            this.dynamicRenderEnabled = false;
        }

        this.renderStartPos = this.renderDirection == 1 ? 0 : REV_RENDER_START_POS;
        this.renderEndPos = this.renderDirection == 1 ? 0 : REV_RENDER_START_POS;

        // Create end-of list view for dynamic rendering
        if(!this.eofListView)
            this.eofListView = systemUi.createWidget(systemUi.widget.IMG, {
                x: 0,
                y: this.renderStartPos,
                w: 10,
                h: 1,
                src: "",
            });

        this.addComponent(this.buildHeader());
        for(const component of this.build())
            if(component != null)
                this.addComponent(component);

        if(this.renderDirection == -1)
            PageTools.scrollTo({y: -REV_RENDER_START_POS + SCREEN_HEIGHT});
    }

    protected onDestroy(): any {
        // Nothing to do
    }

    /**
     * Rebuild entire screen (this is VERY SLOW, use only if you really need this)
     */
    rebuildAll() {
        for(const component of this.nestedComponents) {
            component.performDestroy();
        }

        this.focusPosition = -1;
        this.nestedComponents = [];
        this.childPositionInfo = [];

        this.onRender();
    }

    /**
     * Dynamically add component to end of stack.
     *
     * @param component Component to add
     * @param at Target index position
     */
    addComponent(component: Component<any>, at: number = this.nestedComponents.length) {
        component.attachParent(this);

        let height: number = null;
        if(this.nestedComponents.length == 0)
            height = this.renderDirection == 1 ? TOP_MARGIN : BOTTOM_MARGIN;
        component.setGeometry(null, null, WIDGET_WIDTH, height);

        if(at == this.nestedComponents.length) {
            this.nestedComponents.push(component);
            this.repositionComponents(at, this.renderEndPos);
        } else {
            this.injectComponentToPosition(component, at);
            this.onChildHeightChanged();
        }

        if(this.dynamicRenderEnabled) {
            this.dynamicRender(this.nestedComponents.length - 1);
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
        this.childPositionInfo = [
            ...this.childPositionInfo.slice(0, at),
            {lastHeight: -1, y: -1},
            ...this.childPositionInfo.slice(at),
        ]
    }

    /**
     * Dynamically remove component.
     *
     * @param component Component to remove
     */
    removeComponent(component: Component<any>) {
        for(let i = 0; i < this.nestedComponents.length; i++)
            if(this.nestedComponents[i] == component)
                return this.removeComponentAt(i);
    }

    /**
     * Remove component at defined position
     *
     * @param index Component position
     * @private
     */
    private removeComponentAt(index: number) {
        const component = this.nestedComponents[index];
        component.performDestroy();

        this.nestedComponents = this.nestedComponents.filter((_, i) => i != index);
        this.childPositionInfo = this.childPositionInfo.filter((_ , i) => i != index);

        // Re-position all items bellow current
        const y = index == 0 ? this.renderStartPos :
            this.childPositionInfo[index - 1].y + this.childPositionInfo[index - 1].lastHeight;
        this.repositionComponents(index, y);

        // If focus position is equal to removed item, we should set it to next one
        if(this.focusPosition == index) {
            const cmp = this.nestedComponents[index];
            cmp.onFocus && cmp.onFocus();
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
        for(i = 0 ; i < this.nestedComponents.length; i++) {
            if(this.nestedComponents[i].geometry.h != this.childPositionInfo[i].lastHeight)
                break;

            y += this.renderDirection * this.childPositionInfo[i].lastHeight;
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
        for(; i < this.nestedComponents.length; i++) {
            const cmp = this.nestedComponents[i]
            const height = cmp.geometry.h;
            // console.log("reposition", i, y, height);
            cmp.setGeometry(
                SCREEN_MARGIN,
                this.renderDirection == 1 ? y : y - height
            );
            this.childPositionInfo[i] = {
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
        if(this.renderDirection == 1 && this.renderEndPos != y) {
            this.eofListView.setProperty(systemUi.prop.Y, y + BOTTOM_MARGIN);
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
    protected onInternalTimerTick() {
        super.onInternalTimerTick();
        const scrollPosition = -PageTools.getScrollTop();

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
        this.footerComponent = this.buildSpinner();
        this.performRenderFooter();

        // Call to buildMore
        this.buildMore(this.buildMorePage).then((components) => {
            this.footerComponent.performDestroy();

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
        if(this.footerComponent == null)
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
        const targetY = Math.floor(-PageTools.getScrollTop() + (SCREEN_HEIGHT / 2));
        if(this.renderDirection == 1) {
            // From first to last
            for(let i = 0; i < this.childPositionInfo.length && i >= 0; i++) {
                if(this.childPositionInfo[i].y + this.childPositionInfo[i].lastHeight >= targetY)
                    return i;
            }
        } else {
            // From last to first
            for(let i = this.childPositionInfo.length - 1; i >= 0; i--) {
                if(this.childPositionInfo[i].y >= targetY)
                    return i;
            }
        }
        return 0;
    }

    /**
     * This function will check, which components should be rendered or destroyed in current scroll position.
     * That's a part of dynamic render.
     *
     * @param startIndex Component review start index
     * @param endIndex Component review end index
     * @private
     */
    private dynamicRender(startIndex: number = 0, endIndex: number = this.nestedComponents.length) {
        const scrollPos = -PageTools.getScrollTop();
        const topBaseLine = Math.max(0, scrollPos - SCREEN_HEIGHT);
        const bottomBaseLine = scrollPos + 2 * SCREEN_HEIGHT;
        // console.log(topBaseLine, bottomBaseLine);

        // let debug = "";
        for(let i = startIndex; i < endIndex; i++) {
            const visible = this.childPositionInfo[i].y >= topBaseLine && this.childPositionInfo[i].y <= bottomBaseLine
            // debug += visible ? "1" : "0";
            if(!visible && this.nestedComponents[i].isRendered) {
                this.nestedComponents[i].performDestroy();
            } else if(visible && !this.nestedComponents[i].isRendered) {
                this.nestedComponents[i].performRender();
            }
        }
        // console.log(debug);
    }

    /**
     * Will vibrate on component focus reach & scroll to them
     *
     * @protected
     */
    protected onWheelFocusChange() {
        super.onWheelFocusChange();
        performVibration(23, 25);
        this.scrollToFocusedChild();
    }

    /**
     * Will scroll to newly focused child.
     * @protected
     */
    protected scrollToFocusedChild() {
        const {y, h} = this.nestedComponents[this.focusPosition].geometry;
        this.smoothScrollPosition = y - (DeviceInfo.height - h) / 2;
    }

    /**
     * Should return set of components that will be rendered on page start.
     */
    protected build() : Component<any>[] {
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
    protected buildHeader(): Component<any> {
        return new UiDrawRectangleComponent({
            color: 0,
        });
    }

    /**
     * Should create footer component, that will be drawn on page end, when
     * noting more present in buildMore() and build()
     */
    protected buildFooter(): Component<any> {
        return new UiDrawRectangleComponent({
            color: 0
        });
    }

    /**
     * Should create loading footer for buildMore()
     */
    protected buildSpinner(): Component<any> | null {
        // if(DEVICE_SHAPE == "band")
        // TODO: Low-ram view

        return new AnimComponent({
            imageWidth: 48,
            imageHeight: 16,
            imagesPath: "mzfw/spin_sm",
            imagesPrefix: "anim",
            imagesCount: 7,
            fps: 21,
        });
    }

    /**
     * Unused
     */
    protected getAutoHeight(): number {
        return SCREEN_HEIGHT;
    }
}