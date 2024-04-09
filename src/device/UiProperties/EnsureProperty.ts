import { isLegacyDevice } from "../System";

export class ZeppNotSupportedError extends Error {
    name = "ZeppNotSupportedError";
}

export function ensureIsNotLegacyDevice() {
    if(isLegacyDevice)
        throw new ZeppNotSupportedError("This feature not supported on ZeppOS 1.0 devices");
}
