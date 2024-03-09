import {
    LegacyInteractionRelatedHmApp,
    LegacyInteractionRelatedHmUI,
    ZeppInteractionLibrary,
    ZeppInteractionModalInstance,
    ZeppInteractionModalOptions
} from "./Types";
import { glob, isLegacyAPI, osImport } from "../internal";

const sysInter = osImport<ZeppInteractionLibrary>("@zos/interaction", null);

function createLegacyWrapper(): ZeppInteractionLibrary {
    const hmApp: LegacyInteractionRelatedHmApp = glob["hmApp"];
    const hmUI: LegacyInteractionRelatedHmUI = glob["hmUI"];

    return {
        GESTURE_DOWN: hmApp.gesture.DOWN,
        GESTURE_LEFT: hmApp.gesture.LEFT,
        GESTURE_RIGHT: hmApp.gesture.RIGHT,
        GESTURE_UP: hmApp.gesture.UP,
        KEY_BACK: hmApp.key.BACK,
        KEY_DOWN: hmApp.key.DOWN,
        KEY_EVENT_CLICK: hmApp.action.CLICK,
        KEY_EVENT_DOUBLE_CLICK: hmApp.action.DOUBLE_CLICK,
        KEY_EVENT_LONG_PRESS: hmApp.action.LONG_PRESS,
        KEY_EVENT_PRESS: hmApp.action.PRESS,
        KEY_EVENT_RELEASE: hmApp.action.RELEASE,
        KEY_HOME: hmApp.key.HOME,
        KEY_SELECT: hmApp.key.SELECT,
        KEY_SHORTCUT: hmApp.key.SHORTCUT,
        KEY_UP: hmApp.key.UP,
        MODAL_CANCEL: 0,
        MODAL_CONFIRM: 1,
        createModal(options: ZeppInteractionModalOptions): ZeppInteractionModalInstance {
            return hmUI.createDialog({
                show: options.show,
                auto_hide: options.autoHide,
                title: options.content,
                click_linster(result: 0 | 1) {
                    options.onClick && options.onClick({type: result});
                },
            });
        },
        offDigitalCrown(): void {
            hmApp.unregisterSpinEvent();
        },
        offGesture(): void {
            hmApp.unregisterGestureEvent();
        },
        offKey(): void {
            hmApp.unregisterKeyEvent();
        },
        onDigitalCrown(option: { callback: (key: number, degree: number) => any }): void {
            hmApp.registerSpinEvent(option.callback);
        },
        onGesture(option: { callback: (event: number) => boolean }): void {
            hmApp.registerGestureEvent(option.callback);
        },
        onKey(option: { callback: (key: number, event: number) => boolean }): void {
            hmApp.registerKeyEvent(option.callback);
        },
        showToast(options: { content: string }): void {
            hmUI.showToast({text: options.content})
        },
    }
}

export const {
    createModal,
    MODAL_CONFIRM,
    MODAL_CANCEL,
    offGesture,
    onGesture,
    GESTURE_RIGHT,
    GESTURE_UP,
    KEY_BACK,
    KEY_DOWN,
    KEY_EVENT_CLICK,
    KEY_EVENT_DOUBLE_CLICK,
    KEY_EVENT_LONG_PRESS,
    KEY_EVENT_PRESS,
    KEY_EVENT_RELEASE,
    KEY_HOME,
    KEY_SELECT,
    GESTURE_LEFT,
    KEY_UP,
    KEY_SHORTCUT,
    offDigitalCrown,
    offKey,
    onKey,
    showToast,
    onDigitalCrown,
    GESTURE_DOWN,
}: ZeppInteractionLibrary = isLegacyAPI ? createLegacyWrapper() : sysInter;
