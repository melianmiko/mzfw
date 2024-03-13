export type ZeppPackageInfo = {
    appId: number,
    appName: string,
    appType: "app" | "watchface",
    version: {
        code: number,
        name: string,
    },
    icon: string,
    vender: string,
    venderId?: number,
    description?: string,
}

export type ZeppAppLibrary = {
    getPackageInfo(): ZeppPackageInfo,
}

export type LegacyZeppAppLibrary = {
    packageInfo(): ZeppPackageInfo,
}
