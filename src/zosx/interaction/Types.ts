export type ZeppInteractionLibrary = {
    GESTURE_DOWN: number;
    GESTURE_LEFT: number,
    GESTURE_RIGHT: number,
    GESTURE_UP: number,
    KEY_BACK: number;
    KEY_DOWN: number;
    KEY_EVENT_CLICK: number;
    KEY_EVENT_DOUBLE_CLICK: number,
    KEY_EVENT_LONG_PRESS: number,
    KEY_EVENT_PRESS: number,
    KEY_EVENT_RELEASE: number,
    KEY_HOME: number,
    KEY_SELECT: number,
    KEY_SHORTCUT: number,
    KEY_UP: number,
    MODAL_CANCEL: number,
    MODAL_CONFIRM: number,
    createModal(options: ZeppInteractionModalOptions): ZeppInteractionModalInstance,
    offDigitalCrown(): void,
    offGesture(): void,
    offKey(): void,
    onDigitalCrown(option: { callback: (key: number, degree: number) => any }): void,
    onGesture(option: { callback: (event: number) => boolean }): void,
    onKey(option: { callback: (key: number, event: number) => boolean }): void,
    showToast(options: { content: string }): void,
}

export type LegacyInteractionRelatedHmUI = {
    showToast(options: { text: string }): void,
    createDialog(options: LegacyZeppDialogOptions): ZeppInteractionModalInstance,
}

export type LegacyInteractionRelatedHmApp = {
    registerGestureEvent(callback: (event: number) => boolean): void;
    registerKeyEvent(callback: (key: number, action: number) => boolean): void;
    registerSpinEvent(callback: (key: number, degree: number) => any): void;
    unregisterGestureEvent(): void;
    unregisterKeyEvent(): void;
    unregisterSpinEvent(): void;
    key: {
        BACK: number,
        SELECT: number,
        HOME: number,
        UP: number,
        DOWN: number,
        SHORTCUT: number,
    },
    action: {
        CLICK: number,
        DOUBLE_CLICK: number,
        LONG_PRESS: number,
        RELEASE: number,
        PRESS: number,
    },
    gesture: {
        UP: number,
        DOWN: number,
        LEFT: number,
        RIGHT: number,
    }
}

/**
 * Dialog options
 */
export interface LegacyZeppDialogOptions {
    title: string;
    click_linster(result: 0|1): void;
    show?: boolean;
    auto_hide?: boolean;
}


export type ZeppInteractionModalOptions = {
    content: string,
    show?: boolean,
    onClick?(keyObj: {type: number}): any,
    autoHide?: boolean,
}

export type ZeppInteractionModalInstance = {
    show(): void,
}
