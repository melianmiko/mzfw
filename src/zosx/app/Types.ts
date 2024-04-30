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

export type ZeppRequestPermissionContext = {
    permissions: string[],
    callback: (result: number[]) => any
}

export type ZeppAppLibrary = {
    getPackageInfo(): ZeppPackageInfo,
    queryPermission(request: {permissions: string[]}): number[],
    requestPermission(request: ZeppRequestPermissionContext): number;
}

export type LegacyZeppAppLibrary = {
    packageInfo(): ZeppPackageInfo,
}
