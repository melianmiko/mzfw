declare const global: any;
declare const __$$R$$__: any;

/**
 * Global JS namespace
 */
export const glob = ((): any => {
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
 * @param modernName Name for modern import (aka @zos/ui)
 * @param legacyName name for legacy import (aka hmUI)
 */
export function osImport<P>(modernName: string|null, legacyName: string|null): P {
    if(isLegacyAPI)
        return legacyName ? glob[legacyName] : null;
    return modernName ? __$$R$$__(modernName) : null;
}
