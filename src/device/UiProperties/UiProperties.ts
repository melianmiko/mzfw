import { getDeviceInfo } from "../../zosx/device";
import { ZeppDeviceInfo } from "../../zosx/device/Types";

/**
 * Generic device info (Cross-runtime import)
 */
export const DeviceInfo: ZeppDeviceInfo = getDeviceInfo();

/**
 * Screen width
 */
export const SCREEN_WIDTH = DeviceInfo.width;

/**
 * Screen height
 */
export const SCREEN_HEIGHT = DeviceInfo.height;

/**
 * Device screen shape (circle, square or band)
 */
export const DEVICE_SHAPE = DeviceInfo.screenShape === 1 ? "circle" : (DeviceInfo.width / DeviceInfo.height) > 0.6 ? "square" : "band" ;

export const IS_LOW_RAM_DEVICE = DEVICE_SHAPE == "band";

export const IS_SMALL_SCREEN_DEVICE = SCREEN_WIDTH < 380;

export const IS_BAND_7 = DeviceInfo.deviceName.toLowerCase().indexOf(" band 7") > -1;

export const IS_MI_BAND_7 = DEVICE_SHAPE == "band" && SCREEN_HEIGHT == 490;

/**
 * All non-circle devices have status bar, except Mi Band 7
 */
export const HAVE_STATUS_BAR = DEVICE_SHAPE != "circle" && !IS_MI_BAND_7;
export const STATUS_BAR_HEIGHT = DEVICE_SHAPE == "band" ? 32 : 56;

/**
 * Screen left-right margin
 */
export const SCREEN_MARGIN: number = DEVICE_SHAPE == "circle" ? 16 : 0;

/**
 * Base list widget width
 */
export const WIDGET_WIDTH = SCREEN_WIDTH - SCREEN_MARGIN * 2;

/**
 * Page top margin
 */
export const TOP_MARGIN = ((): number => {
    if(DEVICE_SHAPE == "circle") return Math.floor(SCREEN_HEIGHT * 0.4); // Circle
    if(DEVICE_SHAPE == "band" && IS_MI_BAND_7) return 96; // Mi Band 7
    return 56; // square, ab7
})();

/**
 * Page bottom margin
 */
export const BOTTOM_MARGIN = DEVICE_SHAPE === "circle" ? Math.floor(SCREEN_HEIGHT * 0.3) : 80;

export const BASE_FONT_SIZE = ((): number => {
    if(DEVICE_SHAPE == "band") return 20;
    return Math.min(32, Math.floor(SCREEN_WIDTH / 12));
})();

export const ICON_SIZE = DEVICE_SHAPE == "band" ? 24 : 48;

export const ICON_OFFSET = IS_SMALL_SCREEN_DEVICE ? 8 : 16;

export const ICON_OFFSET_AFTER_MPX = DEVICE_SHAPE == "band" ? 1 : 2;
