
import { ZeppWidgetGenericOptions } from "./WidgetOptionTypes";

/**
 * hmUI base type
 */
export interface ZeppUiLibrary extends ZeppGroupInstance {
    align: ZeppWidgetAlignMode,
    anim_status: ZeppWidgetAnimStatus,
    data_type: ZeppWidgetDataType,
    date: ZeppWidgetDateProp,
    deleteWidget(widget: ZeppWidget<any, any>): void,
    edit_type: ZeppWidgetEditType,
    edit_widget_group_type: ZeppWidgetEditGroupType,
    event: ZeppWidgetEvent,
    getTextLayout(text: string, options: TextLayoutOptions): TextLayoutData | null,
    getAppWidgetSize(): ZeppAppWidgetSize,
    setAppWidgetSize(props: Partial<ZeppAppWidgetSize>): void;
    prop: ZeppWidgetProperty,
    redraw?(): void,
    setStatusBarVisible(visible: boolean): void,
    show_level: ZeppWidgetShowLevel,
    system_status: ZeppWidgetSystemStatus,
    text_style: ZeppWidgetTextStyle,
    updateStatusBarTitle(title: string): void,
    widget: ZeppWidgetID,

    // Require a wrapper

    // Moved/deleted in 2.0
    // setScrollView(enable: boolean, pageHeight: number, pageCount: number, isVertical: boolean): void,
    // scrollToPage(index: number, animation: boolean): void,
    // setLayerScrolling(value: boolean): void,
}

export interface ZeppAppWidgetSize {
    w: number,
    h: number,
    margin: number,
    radius: number,
}

export interface ZeppGroupInstance {
    createWidget<O = any, R = {}>(id: ZeppWidgetID, options: O):
        ZeppWidget<O & ZeppWidgetGenericOptions, R>,
}

/**
 * `hmUI.createWidget()` instance
 */
export type ZeppWidget<O, R> = R & {
    setProperty(id: ZeppWidgetProperty, value: string | number | O | any): void,
    getProperty(id: ZeppWidgetProperty): any;
    addEventListener(event: ZeppWidgetEvent, callback: (p: ZeppWidgetEventData) => any): void,
}

export interface ZeppWidgetEventData {
    x: number,
    y: number,
}

export interface TextLayoutOptions {
    text_size: number,
    text_width: number,
    wrapped?: 0|1,
}

export interface TextLayoutData {
    width: number,
    height: number,
}

export type ZeppWidgetAlignMode = {
    LEFT: ZeppWidgetAlignMode,
    RIGHT: ZeppWidgetAlignMode,
    CENTER_H: ZeppWidgetAlignMode,
    TOP: ZeppWidgetAlignMode,
    BOTTOM: ZeppWidgetAlignMode,
    CENTER_V: ZeppWidgetAlignMode,
}

// noinspection SpellCheckingInspection
export type ZeppWidgetAnimStatus = {
    UNKNOW: ZeppWidgetAnimStatus,
    START: ZeppWidgetAnimStatus,
    PAUSE: ZeppWidgetAnimStatus,
    STOP: ZeppWidgetAnimStatus,
    RESUME: ZeppWidgetAnimStatus,
}

// noinspection SpellCheckingInspection
export type ZeppWidgetDataType = {
    STEP: ZeppWidgetDataType,
    STEP_TARGET: ZeppWidgetDataType,
    CAL: ZeppWidgetDataType,
    CAL_TARGET: ZeppWidgetDataType,
    HEART: ZeppWidgetDataType,
    PAI_DAILY: ZeppWidgetDataType,
    PAI_WEEKLY: ZeppWidgetDataType,
    HUMIDITY: ZeppWidgetDataType,
    SMS: ZeppWidgetDataType,
    BATTERY: ZeppWidgetDataType,
    WEATHER: ZeppWidgetDataType,
    WEATHER_HIGH_LOW: ZeppWidgetDataType,
    WEATHER_HIGH: ZeppWidgetDataType,
    WEATHER_LOW: ZeppWidgetDataType,
    SUN_SET: ZeppWidgetDataType,
    SUN_RISE: ZeppWidgetDataType,
    SUN_CURRENT: ZeppWidgetDataType,
    SUN_TIME: ZeppWidgetDataType,
    MOON_SET: ZeppWidgetDataType,
    MOON_RISE: ZeppWidgetDataType,
    MOON_CURRENT: ZeppWidgetDataType,
    WIND: ZeppWidgetDataType,
    WIND_DIRECTION: ZeppWidgetDataType,
    TIME: ZeppWidgetDataType,
    UVI: ZeppWidgetDataType,
    BODY_TEMP: ZeppWidgetDataType,
    WEATHER_CURRENT: ZeppWidgetDataType,
    DISTANCE: ZeppWidgetDataType,
    STAND: ZeppWidgetDataType,
    STAND_TARGET: ZeppWidgetDataType,
    SPO2: ZeppWidgetDataType,
    AQI: ZeppWidgetDataType,
    ALTIMETER: ZeppWidgetDataType,
    MOON: ZeppWidgetDataType,
    SUN: ZeppWidgetDataType,
    STRESS: ZeppWidgetDataType,
    FAT_BURN: ZeppWidgetDataType,
    FAT_BURN_TARGET: ZeppWidgetDataType,
    FLOOR: ZeppWidgetDataType,
    COUNT_DOWN: ZeppWidgetDataType,
    STOP_WATCH: ZeppWidgetDataType,
    ALARM_CLOCK: ZeppWidgetDataType,
    SLEEP: ZeppWidgetDataType,
    MENSYRUAL_LEVEL: ZeppWidgetDataType,
    MENSYRUAL: ZeppWidgetDataType,
    WEEK: ZeppWidgetDataType,
    MONTH: ZeppWidgetDataType,
    DAYS_PER_MONTH: ZeppWidgetDataType,
    SYSTEM_STATUS: ZeppWidgetDataType,
    ALTITUDE: ZeppWidgetDataType,
    BARO: ZeppWidgetDataType,
    FATIGUE: ZeppWidgetDataType,
    OUTDOOR_RUNNING: ZeppWidgetDataType,
    WALKING: ZeppWidgetDataType,
    OUTDOOR_CYCLING: ZeppWidgetDataType,
    FREE_TRAINING: ZeppWidgetDataType,
    POOL_SWIMMING: ZeppWidgetDataType,
    OPEN_WATER_SWIMMING: ZeppWidgetDataType,
    TRAINING_LOAD: ZeppWidgetDataType,
    VO2MAX: ZeppWidgetDataType,
    RECOVERY_TIME: ZeppWidgetDataType,
    ACTIVITY: ZeppWidgetDataType,
    ALEXA: ZeppWidgetDataType,
    SBPRESSURE: ZeppWidgetDataType,
    DBPRESSURE: ZeppWidgetDataType,
    FAT_BURNING: ZeppWidgetDataType,
    FAT_BURNING_TARGET: ZeppWidgetDataType,
}

export type ZeppWidgetDateProp = {
    MONTH: ZeppWidgetDateProp,
    DAY: ZeppWidgetDateProp,
    WEEK: ZeppWidgetDateProp,
}

// noinspection SpellCheckingInspection
export type ZeppWidgetEditType = {
    STEP: ZeppWidgetEditType,
    BATTERY: ZeppWidgetEditType,
    HEART: ZeppWidgetEditType,
    CAL: ZeppWidgetEditType,
    DISTANCE: ZeppWidgetEditType,
    AQI: ZeppWidgetEditType,
    HUMIDITY: ZeppWidgetEditType,
    UVI: ZeppWidgetEditType,
    DATE: ZeppWidgetEditType,
    WEEK: ZeppWidgetEditType,
    WEATHER: ZeppWidgetEditType,
    TEMPERATURE: ZeppWidgetEditType,
    SUN: ZeppWidgetEditType,
    STAND: ZeppWidgetEditType,
    SUN_RISE: ZeppWidgetEditType,
    SUN_SET: ZeppWidgetEditType,
    WIND: ZeppWidgetEditType,
    SPO2: ZeppWidgetEditType,
    STRESS: ZeppWidgetEditType,
    FAT_BURN: ZeppWidgetEditType,
    FLOOR: ZeppWidgetEditType,
    ALTIMETER: ZeppWidgetEditType,
    BODY_TEMP: ZeppWidgetEditType,
    MOON: ZeppWidgetEditType,
    PAI_DAILY: ZeppWidgetEditType,
    PAI: ZeppWidgetEditType,
    PAI_WEEKLY: ZeppWidgetEditType,
    APP_PAI: ZeppWidgetEditType,
    SMS: ZeppWidgetEditType,
    TIME: ZeppWidgetEditType,
    WEATHER_CURRENT: ZeppWidgetEditType,
    WEATHER_HIGH: ZeppWidgetEditType,
    WEATHER_LOW: ZeppWidgetEditType,
    WIND_DIRECTION: ZeppWidgetEditType,
    COUNT_DOWN: ZeppWidgetEditType,
    STOP_WATCH: ZeppWidgetEditType,
    SLEEP: ZeppWidgetEditType,
    ALARM_CLOCK: ZeppWidgetEditType,
    MENSYRUAL: ZeppWidgetEditType,
    TRAINING_LOAD: ZeppWidgetEditType,
    VO2MAX: ZeppWidgetEditType,
    RECOVERY_TIME: ZeppWidgetEditType,
    ALTITUDE: ZeppWidgetEditType,
    FATIGUE: ZeppWidgetEditType,
    INVALID: ZeppWidgetEditType,
}

export type ZeppWidgetEditGroupType = {
    FOUNDATION: ZeppWidgetEditGroupType,
    OUTDOORS: ZeppWidgetEditGroupType,
    TOOLS: ZeppWidgetEditGroupType,
    MULTIMEDIA: ZeppWidgetEditGroupType,
    PAY: ZeppWidgetEditGroupType,
    HEALTH: ZeppWidgetEditGroupType,
    SPORTS: ZeppWidgetEditGroupType,
    WEATHER: ZeppWidgetEditGroupType,
    OTHERS: ZeppWidgetEditGroupType,
    INVALID: ZeppWidgetEditGroupType,
}

// noinspection SpellCheckingInspection
export type ZeppWidgetProperty = {
    MORE: ZeppWidgetProperty,
    X: ZeppWidgetProperty,
    Y: ZeppWidgetProperty,
    W: ZeppWidgetProperty,
    H: ZeppWidgetProperty,
    POS_X: ZeppWidgetProperty,
    POS_Y: ZeppWidgetProperty,
    ANGLE: ZeppWidgetProperty,
    CENTER_X: ZeppWidgetProperty,
    CENTER_Y: ZeppWidgetProperty,
    SRC: ZeppWidgetProperty,
    TEXT: ZeppWidgetProperty,
    COLOR: ZeppWidgetProperty,
    COLOR_BG: ZeppWidgetProperty,
    START_ANGLE: ZeppWidgetProperty,
    END_ANGLE: ZeppWidgetProperty,
    LINE_WIDTH: ZeppWidgetProperty,
    LINE_START_X: ZeppWidgetProperty,
    LINE_START_Y: ZeppWidgetProperty,
    LINE_END_X: ZeppWidgetProperty,
    LINE_END_Y: ZeppWidgetProperty,
    LINE_PROGRESS: ZeppWidgetProperty,
    SRC_BG: ZeppWidgetProperty,
    SRC_PROGRESS: ZeppWidgetProperty,
    SRC_INDICATOR: ZeppWidgetProperty,
    ALIGN_H: ZeppWidgetProperty,
    ALIGN_V: ZeppWidgetProperty,
    IMAGE_ARRAY: ZeppWidgetProperty,
    IMAGE_LENGTH: ZeppWidgetProperty,
    LEVEL: ZeppWidgetProperty,
    TYPE: ZeppWidgetProperty,
    TEXT_SIZE: ZeppWidgetProperty,
    FONT: ZeppWidgetProperty,
    ID: ZeppWidgetProperty,
    DATASET: ZeppWidgetProperty,
    ANIM_STATUS: ZeppWidgetProperty,
    ANIM_IS_RUNINNG: ZeppWidgetProperty,
    ANIM_IS_RUNNING: ZeppWidgetProperty,
    ANIM_IS_PAUSE: ZeppWidgetProperty,
    ANIM_IS_STOP: ZeppWidgetProperty,
    ANIM: ZeppWidgetProperty,
    RADIUS: ZeppWidgetProperty,
    ALPHA: ZeppWidgetProperty,
    VISIBLE: ZeppWidgetProperty,
    INIT: ZeppWidgetProperty,
    CHECKED: ZeppWidgetProperty,
    SHOW: ZeppWidgetProperty,
    UNCHECKED: ZeppWidgetProperty,
    CURRENT_SELECT: ZeppWidgetProperty,
    TEXT_STYLE: ZeppWidgetProperty,
    CHAR_SPACE: ZeppWidgetProperty,
    LINE_SPACE: ZeppWidgetProperty,
    END_X: ZeppWidgetProperty,
    CURRENT_TYPE: ZeppWidgetProperty,
    UPDATE_DATA: ZeppWidgetProperty,
    SELECT_INDEX: ZeppWidgetProperty,
    CURRENT_CONFIG: ZeppWidgetProperty,
    ITEM_MORE: ZeppWidgetProperty,
    ITEM_REFRESH: ZeppWidgetProperty,
    LIST_TOP: ZeppWidgetProperty,
    CORNER_RADIUS: ZeppWidgetProperty,
    AUTO_SCALE: ZeppWidgetProperty,
    AUTO_SCALE_OBJ_FIT: ZeppWidgetProperty,
    ANIM_STEP: ZeppWidgetProperty,
    ANIM_FRAME_CUR_INDEX: ZeppWidgetProperty,
    ANIM_PLAY_BACK: ZeppWidgetProperty,
    UPDATE_ITEM: ZeppWidgetProperty,
    DELETE_ITEM: ZeppWidgetProperty,
    MOVE_ITEM: ZeppWidgetProperty,
}

// noinspection SpellCheckingInspection
export type ZeppWidgetShowLevel = {
    ALL: ZeppWidgetShowLevel,
    ONLY_NORMAL: ZeppWidgetShowLevel,
    ONAL_AOD: ZeppWidgetShowLevel,
    ONLY_AOD: ZeppWidgetShowLevel,
    ONLY_EDIT: ZeppWidgetShowLevel,
}

export type ZeppWidgetEvent = {
    MOVE: ZeppWidgetEvent,
    CLICK_DOWN: ZeppWidgetEvent,
    CLICK_UP: ZeppWidgetEvent,
    MOVE_IN: ZeppWidgetEvent,
    MOVE_OUT: ZeppWidgetEvent,
    SELECT: ZeppWidgetEvent,
    GESTURE_RIGHT: ZeppWidgetEvent,
    GESTURE_LEFT: ZeppWidgetEvent,
    GESTURE_UP: ZeppWidgetEvent,
    GESTURE_DOWN: ZeppWidgetEvent,
    KEY_UP: ZeppWidgetEvent,
    KEY_DOWN: ZeppWidgetEvent,
}

export type ZeppWidgetTextStyle = {
    CHAR_WRAP: ZeppWidgetTextStyle,
    WRAP: ZeppWidgetTextStyle,
    ELLIPSIS: ZeppWidgetTextStyle,
    NONE: ZeppWidgetTextStyle,
}

export type ZeppWidgetSystemStatus = {
    DISCONNECT: ZeppWidgetSystemStatus,
    DISTURB: ZeppWidgetSystemStatus,
    LOCK: ZeppWidgetSystemStatus,
    CLOCK: ZeppWidgetSystemStatus,
}

// noinspection SpellCheckingInspection
/**
 * Enum type: `hmUI.widget`
 */
export type ZeppWidgetID = {
    IMG: ZeppWidgetID,
    GROUP: ZeppWidgetID,
    TEXT: ZeppWidgetID,
    ARC: ZeppWidgetID,
    FILL_RECT: ZeppWidgetID,
    STROKE_RECT: ZeppWidgetID,
    TEXT_IMG: ZeppWidgetID,
    ARC_PROGRESS: ZeppWidgetID,
    LINE_PROGRESS: ZeppWidgetID,
    IMG_PROGRESS: ZeppWidgetID,
    IMG_LEVEL: ZeppWidgetID,
    IMG_GROUP: ZeppWidgetID,
    IMG_POINTER: ZeppWidgetID,
    IMG_DATE: ZeppWidgetID,
    IMG_WEEK: ZeppWidgetID,
    IMG_TIME: ZeppWidgetID,
    IMG_ANIM: ZeppWidgetID,
    IMG_STATUS: ZeppWidgetID,
    IMG_CLICK: ZeppWidgetID,
    IMG_FILL: ZeppWidgetID,
    TEXT_TIME: ZeppWidgetID,
    TIME_NUM: ZeppWidgetID,
    CYCLE_LIST: ZeppWidgetID,
    CIRCLE: ZeppWidgetID,
    STATE_BUTTON: ZeppWidgetID,
    RADIO_GROUP: ZeppWidgetID,
    CHECKBOX_GROUP: ZeppWidgetID,
    BUTTON: ZeppWidgetID,
    SLIDE_SWITCH: ZeppWidgetID,
    DIALOG: ZeppWidgetID,
    SCROLL_LIST: ZeppWidgetID,
    VIEW_CONTAINER: ZeppWidgetID,
    CYCLE_IMAGE_TEXT_LIST: ZeppWidgetID,
    TIME_POINTER: ZeppWidgetID,
    WATCHFACE_EDIT_MASK: ZeppWidgetID,
    WATCHFACE_EDIT_FG_MASK: ZeppWidgetID,
    WATCHFACE_EDIT_GROUP: ZeppWidgetID,
    WATCHFACE_EDIT_BG: ZeppWidgetID,
    HISTOGRAM: ZeppWidgetID,
    DATE_POINTER: ZeppWidgetID,
    TEXT_FONT: ZeppWidgetID,
    WIDGET_DELEGATE: ZeppWidgetID,
    GRADKIENT_POLYLINE: ZeppWidgetID,
    PICK_TIME: ZeppWidgetID,
    PICK_DATE: ZeppWidgetID,
    WATCHFACE_EDIT_POINTER: ZeppWidgetID,
    ARC_PROGRESS_FILL: ZeppWidgetID,
    QRCODE: ZeppWidgetID,
    BARCODE: ZeppWidgetID,
    PAGE_INDICATOR: ZeppWidgetID,
    WATCHFACE_EDIT_TIME: ZeppWidgetID,
}
