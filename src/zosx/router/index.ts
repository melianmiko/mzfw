import { glob, isLegacyAPI, osImport } from "../internal";
import {
    LegacyRouterRelatedHmApp,
    ZeppRouterLaunchOptions,
    ZeppRouterLibrary,
    ZeppRouterPushOptions,
    ZeppRouterTimeoutLaunchOptions
} from "./Types";

const sysRouter = osImport<ZeppRouterLibrary>("@zos/router", null);

const legacyWrapper: ZeppRouterLibrary = {
    back(): void {
        const hmApp: LegacyRouterRelatedHmApp = glob["hmApp"];
        return hmApp.goBack();
    },
    clearLaunchAppTimeout(options: { timeoutId: number } | number): void {
        const hmApp: LegacyRouterRelatedHmApp = glob["hmApp"];
        return hmApp.alarmCancel(typeof options == "number" ? options : options.timeoutId);
    },
    exit(): void {
        const hmApp: LegacyRouterRelatedHmApp = glob["hmApp"];
        return hmApp.exit();
    },
    home(): void {
        const hmApp: LegacyRouterRelatedHmApp = glob["hmApp"];
        return hmApp.gotoHome();
    },
    launchApp({appId, params, url, native}: ZeppRouterLaunchOptions): void {
        const hmApp: LegacyRouterRelatedHmApp = glob["hmApp"];
        return hmApp.startApp({
            appid: appId,
            native,
            param: params,
            url
        })
    },
    push(options: ZeppRouterPushOptions): void {
        const hmApp: LegacyRouterRelatedHmApp = glob["hmApp"];
        return hmApp.gotoPage({url: options.url, param: options.params});
    },
    replace(options: ZeppRouterPushOptions): void {
        const hmApp: LegacyRouterRelatedHmApp = glob["hmApp"];
        return hmApp.reloadPage({url: options.url, param: options.params});
    },
    setLaunchAppTimeout(options: ZeppRouterTimeoutLaunchOptions): number {
        const hmApp: LegacyRouterRelatedHmApp = glob["hmApp"];
        return hmApp.alarmNew({
            param: options.params,
            appid: options.appId,
            url: options.url,
            date: options.utc,
            delay: options.delay,
        })
    }
}

export const {
    clearLaunchAppTimeout,
    exit,
    home,
    launchApp,
    replace,
    setLaunchAppTimeout,
    push,
    back,
    checkSystemApp,
}: ZeppRouterLibrary = isLegacyAPI ? legacyWrapper : sysRouter;
