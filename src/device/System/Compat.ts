import { getSystemInfo } from "@zosx/settings";

declare const DeviceRuntimeCore: any;

/**
 * Will be true if device doesn't support runtime higher than 1.0.1.
 * Useful to determinate legacy devices, with malloc bugs and other trash features.
 *
 * Examples: GTS 4 with runtime 1.0 it will be false.
 *           GTS 3, or Band 7 it will be true
 */
export const isLegacyDevice: boolean = typeof DeviceRuntimeCore != "undefined" ? DeviceRuntimeCore.version[0] == "1": false;
export const zeppFeatureLevel: number = parseFloat(getSystemInfo().osVersion);
