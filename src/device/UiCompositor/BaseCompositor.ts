import { type Component } from "../UiComponent";
import { SCREEN_HEIGHT } from "../UiProperties";
import * as Interaction from "../../zosx/interaction";
import { UiTheme } from "./UiTheme";
import { setStatusBarVisible } from "../../zosx/ui";
import { ZeppWidgetEventData } from "../../zosx/ui/Types";
import { getScrollTop, scrollTo } from "../../zosx/page";
import { IComponentEventReceiver, IRootComponent } from "../UiComponent/Interfaces";

/**
 * RootComponent - base component that can fit another ones into them.
 */
export abstract class BaseCompositor<P> implements IRootComponent, IComponentEventReceiver {
    /**
     * Screen properties
     */
    public props: P;
    /**
     * Page UI theme
     */
    public theme: UiTheme = new UiTheme();
    /**
     * New layer Y position that will be smoothly reached in ~1 second.
     * If null, no smooth scroll is pending. Numeric value mean scrollPosition
     * that should be reached.
     */
    public smoothScrollPosition: number | null = null;
    /**
     * Will change render direction from top-to-bottom to bottom-to-top
     */
    public renderDirection: 1 | -1 = 1;
    /**
     * Remove system status bar on render
     */
    public hideStatusBar: boolean = false;
    protected isRendered: boolean = false;
    /**
     * Components inside this root
     */
    protected nestedComponents: Component<any>[] = [];
    /**
     * Wheel focused item position
     */
    protected focusPosition: number = -1;
    /**
     * Minimum scroll position. If user will scroll upper of them,
     * it will hardly be scrolled back.
     *
     * @protected
     */
    protected minScrollPosition: number = -200;
    /**
     * If true, "Button-mode" like navigation will be disabled.
     * @protected
     */
    protected disableWheelNavigation: boolean = false;
    /**
     * Timer used for scroll position check
     * @private
     */
    private internalTickTimer: NodeJS.Timeout | null = null;

    /**
     * Default root component constructor
     * @param props
     */
    constructor(props: P) {
        this.props = props;
    }

    /**
     * This method will build object entry for ZeppOS `Page()` call.
     *
     * @param page class entry of RootComponent that will be used as page
     */
    static makePage(page: BaseCompositor<any>): any {
        if(!page.performRender)
            throw new Error("makePage syntax is changed: use page instance instead of class entry");

        return {
            onInit(p: string) {
                let props: any = {};
                try {
                    props = JSON.parse(p);
                    page.props = props;
                } catch (e) {}

                page.performRender();
            },
            onDestroy() {
                page.performDestroy();
            }
        };
    }

    /**
     * Render and bind system events.
     */
    performRender() {
        this.isRendered = true;

        // Clean up events from other apps, if they exists
        Interaction.offDigitalCrown();

        // System setup
        setStatusBarVisible(!this.hideStatusBar);
        Interaction.onKey({
            callback: (key: number, action: number) => {
                return this.handleButtonEvent(key, action);
            }
        });

        // Layer scroll check timer
        this.internalTickTimer = setInterval(this.onInternalTimerTick.bind(this), 50);
    }

    /**
     * This method is called every 50-100 ms, it will perform all scroll-desired operation
     * Returns scroll position
     * @protected
     */
    protected onInternalTimerTick(): number {
        const scrollPosition = -getScrollTop();

        if(scrollPosition < this.minScrollPosition) {
            scrollTo({y: -this.minScrollPosition});
        }

        if(this.smoothScrollPosition != null) {
            const step = Math.round((this.smoothScrollPosition - scrollPosition) / 2);
            if(Math.abs(step) < 4) {
                scrollTo({y: -this.smoothScrollPosition});
                this.smoothScrollPosition = null;
            } else {
                scrollTo({y: - scrollPosition - step});
            }
        }

        return scrollPosition;
    }

    /**
     * Delete all screen content, stop all timers and event listeners
     */
    performDestroy() {
        this.isRendered = false;

        // Unregister all
        Interaction.offKey();
        Interaction.offDigitalCrown();
        if(this.internalTickTimer) clearInterval(this.internalTickTimer);
    }

    /**
     * Handle physical button events.
     */
    private handleButtonEvent(key: number, action: number): boolean {
        switch(key) {
            case Interaction.KEY_UP:
                if(action == Interaction.KEY_EVENT_CLICK) return this.onWheelSpin(-1);
                break;
            case Interaction.KEY_DOWN:
                if(action == Interaction.KEY_EVENT_CLICK) return this.onWheelSpin(1);
                break;
            case Interaction.KEY_SELECT:
                this.onWheelButtonEvent(action);
                break;
        }
        return false;
    }

    /**
     * Downcast wheel click event to child component.
     */
    onWheelButtonEvent(action: number): boolean {
        if(this.focusPosition < 0)
            return false;
        return this.nestedComponents[this.focusPosition].onWheelButtonEvent(action);
    }

    /**
     * Handle system wheel spin event.
     * @param degree wheel spin degree
     */
    onWheelSpin(degree: number): boolean {
        if(this.disableWheelNavigation)
            return false;

        degree = this.renderDirection * degree;

        let cy: number | null = null;
        if(this.focusPosition < 0) {
            // Expect that currently is focused previous one component, if we don't know who it is
            const recovered = this.recoverFocusPosition() + (degree > 0 ? -1 : 1);
            if(recovered >= 0 && !this.nestedComponents[recovered].isFocusable)
                return false;
            this.focusPosition = recovered;
        } else {
            // If focus isn't recovered, get current focused item pos to ensure that next one is near to get scroll
            cy = -getScrollTop();
        }

        // Handle with current focused item?
        if(this.focusPosition > -1 && this.nestedComponents[this.focusPosition].onWheelSpin(degree)) {
            return true;
        }

        // Find next one
        let index = this.focusPosition;
        do {
            index = degree > 0 ? index + 1 : index - 1;

            // Is index valid?
            if(index >= this.nestedComponents.length || index < 0)
                return false;

        } while(!this.nestedComponents[index].isFocusable);

        // Is component near?
        if(cy != null && Math.abs((this.nestedComponents[index].geometry.y ?? 0) - cy) > SCREEN_HEIGHT * 0.9)
            return false;

        // Drop focus from current component
        if(this.focusPosition > -1) {
            this.nestedComponents[this.focusPosition].onBlur();
        }

        // Give it to next one
        this.focusPosition = index;
        this.onWheelFocusChange(degree);

        return true;
    }

    /**
     * This function will remove wheel focus from currently focused item, if them exists
     */
    dropWheelFocus() {
        if (this.focusPosition <= -1)
            return;

        const cmp = this.nestedComponents[this.focusPosition]
        cmp.onBlur();
        this.focusPosition = -1;
    }

    /**
     * Handle touch up event
     */
    onTouchUp(_data: ZeppWidgetEventData): boolean {
        return false;
    }

    /**
     * Drop focus when touching grass, or display.
     * @param _data Touch event data, useless for us.
     */
    onTouchDown(_data: ZeppWidgetEventData): boolean {
        this.dropWheelFocus();
        return true;
    }

    /**
     * Return currently focused item, used when it isn't known
     */
    recoverFocusPosition() : number{
        return 0;
    }

    /**
     * Will be called when new item reaches wheel focus
     * @protected
     */
    protected onWheelFocusChange(degree: number) {
        this.nestedComponents[this.focusPosition].onFocus(degree);
    }

    /**
     * Will be called when one of child items height is changed
     * @param child Child that report about height change
     */
    abstract onChildHeightChanged(child: Component<any>): void;

    attachParent() {
        throw new Error("You can't place one compositor into another one");
    }

    protected onComponentUpdate() {}

    onFocus(_degree: number): void {}

    onBlur(): void {}

    onTouchMove(_data: ZeppWidgetEventData): boolean {
        return false;
    }

    onWheelClick(): boolean {
        return false;
    }
}
