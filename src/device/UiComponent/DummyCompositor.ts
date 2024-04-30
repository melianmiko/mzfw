import { IComponentEventReceiver, IRootComponent } from "./Interfaces";
import { UiTheme } from "../UiCompositor";

export const DUMMY_COMPOSITOR: IRootComponent & IComponentEventReceiver = {
    theme: new UiTheme(),
    isRendered: false,
    onChildHeightChanged(): any {},
    setGestureLock(): any {},
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
    }
};
