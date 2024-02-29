declare const global: any;
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
export const systemUi: typeof hmUI = osImport("@zos/ui", "hmUI");

export function createSensor(modernName: string, legacyName: string): any {
    if(isLegacyAPI)
        return hmSensor.createSensor(hmSensor.id[legacyName]);

    const Sensor: any = __$$R$$__("@zos/sensor")[modernName];
    return new Sensor();
}
