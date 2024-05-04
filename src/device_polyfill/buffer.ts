import { glob } from "@zosx/utils";

declare const DeviceRuntimeCore: any;

if(!glob.Buffer) {
    if (typeof Buffer !== 'undefined') {
        glob.Buffer = Buffer
    } else {
        glob.Buffer = DeviceRuntimeCore.Buffer
    }
}
