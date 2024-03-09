import { isLegacyAPI, osImport } from "../internal";
import { ZeppDeviceLibrary } from "./Types";

const _device: ZeppDeviceLibrary = osImport<ZeppDeviceLibrary>("@zos/device", "hmSetting");

export const SCREEN_SHAPE_SQUARE: number = isLegacyAPI ? 0 : _device.SCREEN_SHAPE_SQUARE;
export const SCREEN_SHAPE_ROUND: number = isLegacyAPI ? 1 : _device.SCREEN_SHAPE_ROUND;

export const {
    getDeviceInfo,
} = _device;
