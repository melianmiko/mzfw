import { isLegacyAPI, osImport } from "../internal";
import { LegacyZeppAppLibrary, ZeppAppLibrary, ZeppPackageInfo, ZeppRequestPermissionContext } from "./Types";

const zeppApp = osImport("@zos/app", "hmApp");
const hmAppModern = zeppApp as ZeppAppLibrary;
const hmAppLegacy = zeppApp as LegacyZeppAppLibrary;

export function queryPermission(request: {permissions: string[]}): number[] {
    if(hmAppModern.queryPermission)
        return hmAppModern.queryPermission(request);
    return request.permissions.map(() => 1);
}

export function requestPermission(request: ZeppRequestPermissionContext): number {
    if(hmAppModern.requestPermission)
        return hmAppModern.requestPermission(request);
    return 1;
}

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
