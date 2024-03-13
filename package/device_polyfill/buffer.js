import { glob } from "../zosx/internal";

if(!glob.Buffer) {
    if (typeof Buffer !== 'undefined') {
        glob.Buffer = Buffer
    } else {
        glob.Buffer = DeviceRuntimeCore.Buffer
    }
}
