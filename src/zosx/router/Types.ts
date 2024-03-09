export type ZeppRouterLibrary = {
    back(): void;
    checkSystemApp?(options: {appId: number}): boolean;
    clearLaunchAppTimeout(options: {timeoutId: number} | number): void;
    exit(): void;
    home(): void;
    launchApp(options: ZeppRouterLaunchOptions): void;
    push(options: ZeppRouterPushOptions): void;
    replace(options: ZeppRouterPushOptions): void;
    setLaunchAppTimeout(options: ZeppRouterTimeoutLaunchOptions): number;
}

export type LegacyRouterRelatedHmApp = {
    goBack(): void;
    gotoHome(): void;
    exit(): void;
    startApp(option: {
        appid: number,
        native?: boolean,
        url: string,
        param?: string,
    }): void;
    gotoPage(option: {
        url: string,
        param?: string,
    }): void;
    reloadPage(option: {
        url: string,
        param?: string,
    }): void;
    alarmNew(option: {
        appid: number,
        url: string,
        date?: number,
        delay?: number,
        param?: string,
    }): number;
    alarmCancel(id: number): void;
}

export type ZeppRouterPushOptions = {
    url: string,
    params?: string,
}

export type ZeppRouterLaunchOptions = ZeppRouterPushOptions & {
    appId: number;
    native?: boolean,
}

export type ZeppRouterTimeoutLaunchOptions = {
    appId: number,
    url: string,
    utc?: number,
    delay?: number,
    params?: string,
}
