import { IComponentEventReceiver, IRootComponent } from "./Interfaces";
import { UiTheme } from "../UiCompositor";
import { Component } from "./Component";

export const DUMMY_COMPOSITOR: IRootComponent & IComponentEventReceiver = {
    theme: new UiTheme(),
    onChildHeightChanged(child: Component<any>): any {},
    onBlur(): void {},
    onFocus(): void {},
    onTouchDown(): boolean {
        return false;
    },
    onTouchMove(): boolean {
        return false;
    },
    onTouchUp(): boolean {
        return false;
    },
    onWheelButtonEvent(): boolean {
        return false;
    },
    onWheelClick(): boolean {
        return false;
    },
    onWheelSpin(): boolean {
        return false;
    },
};
