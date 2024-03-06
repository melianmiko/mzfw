import {osImport} from "../System";

export type IDeviceInfo = HmWearableProgram.DeviceSide.HmSetting.IHmSettingDeviceInfo;

/**
 * Generic device info (Cross-runtime import)
 */
export const DeviceInfo: IDeviceInfo = osImport("@zos/device", "hmSetting").getDeviceInfo();

/**
 * Device screen shape (circle, square or band)
 */
export const DEVICE_SHAPE = DeviceInfo.screenShape === 1 ? "circle" : (DeviceInfo.width / DeviceInfo.height) > 0.6 ? "square" : "band" ;

export const IS_LOW_RAM_DEVICE = DEVICE_SHAPE == "band";

export const IS_BAND_7 = DeviceInfo.deviceName.toLowerCase().indexOf(" band 7") > -1;

/**
 * Screen width
 */
export const SCREEN_WIDTH = DeviceInfo.width;

/**
 * Screen height
 */
export const SCREEN_HEIGHT = DeviceInfo.height;

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
    if(DEVICE_SHAPE == "circle") return Math.floor(SCREEN_HEIGHT * 0.4);
    if(DEVICE_SHAPE == "band" && SCREEN_HEIGHT == 490) return 96; // Mi Band 7
    return 56;
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

export const ICON_OFFSET = DEVICE_SHAPE == "band" ? 8 : 16;

export const ICON_OFFSET_AFTER_MPX = DEVICE_SHAPE == "band" ? 1 : 2;
