import { isLegacyAPI, osImport } from "../internal";
import { ZeppUiLibrary } from "./Types";

const _systemUi: ZeppUiLibrary = osImport<ZeppUiLibrary>("@zos/ui", "hmUI");

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
