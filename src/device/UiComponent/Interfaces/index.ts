import { ZeppWidgetEventData } from "../../../zosx/ui/Types";
import { UiTheme } from "../../UiCompositor";
import type { Component } from "../Component";

/**
 * Component's `this.root` type
 */
export interface IRootComponent {
    theme: UiTheme;
    onChildHeightChanged(child: Component<any>): any,
    setGestureLock(lock: boolean): any;
}

export interface IComponentEventReceiver {
    /**
     * Will be called when component get focus from keyboard
     * navigation or wheel.
     * @param degree Rotation degree
     */
    onFocus(degree: number): void;

    /**
     * Will be called when component lose focus from keyboard
     * navigation or wheel.
     */
    onBlur(): void;

    /**
     * Handle wheel selection button event. Is down-casted from parent component
     */
    onWheelButtonEvent(action: number) : boolean;

    /**
     * Your component should call this at CLICK_DOWN.
     * @param data x,y
     */
    onTouchDown(data: ZeppWidgetEventData): boolean;

    /**
     * Your component should call this at CLICK_UP.
     * @param data x,y
     */
    onTouchUp(data: ZeppWidgetEventData): boolean;

    /**
     * Your component should call this at CLICK_MOVE,
     * @param data x,y
     */
    onTouchMove(data: ZeppWidgetEventData): boolean;

    /**
     * Handle wheel click event.
     * Return true if handled
     */
    onWheelClick(): boolean;

    /**
     * Will be called on wheel spin.
     *
     * Return true, if you have handled this event to stop parent handlers.
     * Or return false, if you don't want to handle it.
     *
     * @param _degree
     */
    onWheelSpin(_degree: number): boolean;
}
