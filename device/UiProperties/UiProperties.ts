import {osImport} from "../System";

export const DeviceInfo = osImport("@zos/device", "hmSetting").getDeviceInfo();
export const DEVICE_SHAPE = DeviceInfo.screenShape === 1 ? "circle" : (DeviceInfo.width / DeviceInfo.height) > 0.6 ? "square" : "band" ;
export const SCREEN_WIDTH = DeviceInfo.width;
export const SCREEN_HEIGHT = DeviceInfo.height;
export const SCREEN_MARGIN = 60;
export const WIDGET_WIDTH = SCREEN_WIDTH - SCREEN_MARGIN * 2;
export const TOP_MARGIN = 240;
export const BOTTOM_MARGIN = 120;
