import { isLegacyAPI, osImport } from "../internal";
import { ZeppAppWidgetSize, ZeppUiLibrary } from "./Types";

const _systemUi: ZeppUiLibrary = osImport<ZeppUiLibrary>("@zos/ui", "hmUI");

// For emulator
const DUMMY_APP_WIDGET_SIZE: ZeppAppWidgetSize = {
    w: 400,
    h: 240,
    margin: 40,
    radius: 36,
}


export function setAppWidgetSize(props: Partial<ZeppAppWidgetSize>): void {
    // May not exist in 1.0 API, so wrapped
    return _systemUi.setAppWidgetSize(props);
}

export function getAppWidgetSize(): ZeppAppWidgetSize {
    return _systemUi.getAppWidgetSize() ?? DUMMY_APP_WIDGET_SIZE;
}

export const {
    createWidget,
    widget,
    text_style,
    prop,
    data_type,
    anim_status,
    align,
    system_status,
    show_level,
    edit_widget_group_type,
    event,
    edit_type,
    date,
    setStatusBarVisible,
    redraw,
    updateStatusBarTitle,
    getTextLayout,
    deleteWidget,
}: ZeppUiLibrary = _systemUi;
