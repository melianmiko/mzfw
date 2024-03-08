import {IS_BAND_7} from "./UiProperties";

export class ZeppNotSupportedError extends Error {
    name = "ZeppNotSupportedError";
}

export function ensureIsNotBand7() {
    if(IS_BAND_7)
        throw new ZeppNotSupportedError("This feature not supported on Band 7");
}