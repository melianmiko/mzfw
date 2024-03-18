export type ZeppSettingsLibrary = {
    getSystemInfo(): ZeppSystemInfo,
    getLanguage(): number,
}

export type ZeppSystemInfo = {
    osVersion: string,
    firmwareVersion: string,
    minAPI: string,
}
