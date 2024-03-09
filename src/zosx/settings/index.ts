import { isLegacyAPI, osImport } from "../internal";
import { ZeppSettingsLibrary, ZeppSystemInfo } from "./Types";

const systemSetting = osImport<ZeppSettingsLibrary>("@zos/settings", "hmSetting");

export function getSystemInfo(): ZeppSystemInfo {
    if(isLegacyAPI) return {
        firmwareVersion: "0.0",
        minAPI: "1.0.0",
        osVersion: "1.0.0",
    };

    if(!systemSetting.getSystemInfo) return {
        firmwareVersion: "0.0",
        minAPI: "2.0.0",
        osVersion: "2.0.0",
    };

    return systemSetting.getSystemInfo();
}
