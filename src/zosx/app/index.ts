import { isLegacyAPI, osImport } from "../internal";
import { LegacyZeppAppLibrary, ZeppAppLibrary, ZeppPackageInfo } from "./Types";

const zeppApp = osImport("@zos/app", "hmApp");
const hmAppModern = zeppApp as ZeppAppLibrary;
const hmAppLegacy = zeppApp as LegacyZeppAppLibrary;

export const getPackageInfo: () => ZeppPackageInfo = (() => {
    if(isLegacyAPI && hmAppLegacy) return hmAppLegacy.packageInfo;
    if(hmAppModern) return hmAppModern.getPackageInfo;

    // dummy
    return (): ZeppPackageInfo => {
        return {
            appId: 0,
            appName: "",
            appType: "app",
            icon: "",
            description: "",
            vender: "",
            venderId: 0,
            version: {
                code: 0,
                name: "",
            }
        }
    }
})();
