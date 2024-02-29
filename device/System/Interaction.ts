import {osImport, isLegacyAPI} from "./LegacyImport";
const sysInter: any = osImport("@zos/interaction", "hmApp");

export type OnKeyCallback = (key: number, keyEvent: number) => any;
export const KEY_BACK = isLegacyAPI ? sysInter.key.BACK : sysInter.KEY_BACK;
export const KEY_SELECT = isLegacyAPI ? sysInter.key.SELECT : sysInter.KEY_SELECT;
export const KEY_HOME = isLegacyAPI ? sysInter.key.HOME : sysInter.KEY_HOME;
export const KEY_UP = isLegacyAPI ? sysInter.key.UP : sysInter.KEY_UP;
export const KEY_DOWN = isLegacyAPI ? sysInter.key.DOWN : sysInter.KEY_DOWN;
export const KEY_SHORTCUT = isLegacyAPI ? sysInter.key.SHORTCUT : sysInter.KEY_SHORTCUT;
export const KEY_EVENT_CLICK = isLegacyAPI ? sysInter.action.CLICK : sysInter.KEY_EVENT_CLICK;
export const KEY_EVENT_DOUBLE_CLICK = isLegacyAPI ? sysInter.action.DOUBLE_CLICK : sysInter.KEY_EVENT_DOUBLE_CLICK;
export const KEY_EVENT_LONG_PRESS = isLegacyAPI ? sysInter.action.LONG_PRESS : sysInter.KEY_EVENT_LONG_PRESS;
export const KEY_EVENT_RELEASE = isLegacyAPI ? sysInter.action.RELEASE : sysInter.KEY_EVENT_RELEASE;
export const KEY_EVENT_PRESS = isLegacyAPI ? sysInter.action.PRESS : sysInter.KEY_EVENT_PRESS;

/**
* See ZeppOS docs Interaction1/onKey
*/
export function onKey(callback: OnKeyCallback) {
return isLegacyAPI ? sysInter.registerKeyEvent(callback) : sysInter.onKey(callback);
}

/**
 * See ZeppOS docs Interaction/offKey
 */
export function offKey() {
    return isLegacyAPI ? sysInter.unregisterKeyEvent() : sysInter.offKey();
}

export function onDigitalCrown(opt: {callback: (key: number, degree: number) => any}) {
    return isLegacyAPI ? sysInter.registerSpinEvent(opt.callback) : sysInter.onDigitalCrown(opt);
}

export function offDigitalCrown() {
    return isLegacyAPI ? sysInter.unregisterSpinEvent() : sysInter.offDigitalCrown();
}
