import { glob } from "../../zosx/internal";
import { getPackageInfo } from "../../zosx/app";

export function getAppTags(forceValid: boolean = false): [number, "app"|"watchface"] {
    if(glob["__cache_appPath"])
        return glob["__cache_appPath"];

    console.log("WARN: calling packageInfo(), which may cause app crash on some devices. " +
        "It's recommended to add defineAppTags('type', id) in your app.json before using any mzfw features.");

    try {
        const appInfo = getPackageInfo();
        const data: [number, "app"|"watchface"] = [appInfo.appId, appInfo.appType];
        glob["__cache_appPath"] = data;
        return data;
    } catch(e) {
        console.log("ERROR: CAUTION: getPackageInfo() failed, using placeholder values. Note that " +
            "framework won't work normal with them");

        if(forceValid)
            throw new Error("Use defineAppTags() before reading app tags");

        return [999, 'app'];
    }
}

export function defineAppTags(type: "app" | "watchface", id: number) {
    glob["__cache_appPath"] = [id, type];
}
