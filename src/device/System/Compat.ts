import {IUnsafeMemInfoProvider} from "./Types";

declare const global: any;
declare const DeviceRuntimeCore: any;
declare const __$$R$$__: any;

/**
 * Global JS namespace
 */
export const glob = (() => {
    if (typeof self !== 'undefined') return self;
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;
    if (typeof globalThis !== 'undefined') return globalThis;
    return null;
})();

/**
 * If true, app is targeting ZeppoS 1.0
 */
export const isLegacyAPI: boolean = typeof __$$R$$__ == "undefined";

/**
 * Perform system-level import (aka @zos/ui), or return `legacyName` var
 * if targeting zeppOS 1.0
 *
 * @param name Name for modern import (aka @zos/ui)
 * @param legacyName name for legacy import (aka hmUI)
 */
export function osImport(name: string, legacyName: string): any {
    if(isLegacyAPI)
        return glob[legacyName]
    return __$$R$$__(name);
}

/**
 * hmUI / @zos/ui target independent
 */
export const systemUi = osImport("@zos/ui", "hmUI") as typeof hmUI;
export const systemApp = osImport("@zos/app", "hmApp");
export const systemSetting = osImport("@zos/settings", "hmSetting");
/**
 * Will be true if device doesn't support runtime higher than 1.0.1.
 * Useful to determinate legacy devices, with malloc bugs and other trash features.
 *
 * Examples: GTS 4 with runtime 1.0 it will be false.
 *           GTS 3, or Band 7 it will be true
 */
export const isLegacyDevice: boolean = typeof DeviceRuntimeCore != "undefined" ? DeviceRuntimeCore.version[0] == "1": false;
export const zeppFeatureLevel: number = ((): number => {
    if(isLegacyAPI) return 1;
    if(!systemSetting.getSystemInfo) return 2; // getSystemInfo was added in 2.1

    const systemInfo = systemSetting.getSystemInfo();
    return parseFloat(systemInfo.osVersion);
})();

export function getMemoryUsage() {
    // Undocumented function
    try {
        return (systemApp as IUnsafeMemInfoProvider).getMemUsage();
    } catch(_) {
        return 0;
    }
}

export function createSensor(modernName: string, legacyName: string): any {
    if(isLegacyAPI)
        return hmSensor.createSensor(hmSensor.id[legacyName]);

    const Sensor: any = __$$R$$__("@zos/sensor")[modernName];
    return new Sensor();
}
