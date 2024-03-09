export type ZeppSettingsLibrary = {
    getSystemInfo(): ZeppSystemInfo,
}

export type ZeppSystemInfo = {
    osVersion: string,
    firmwareVersion: string,
    minAPI: string,
}
