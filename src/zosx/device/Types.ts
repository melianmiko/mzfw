export interface ZeppDeviceLibrary {
    SCREEN_SHAPE_ROUND: number;
    SCREEN_SHAPE_SQUARE: number;
    getDeviceInfo(): ZeppDeviceInfo
}

export interface ZeppDeviceInfo {
    width: number,
    height: number,
    screenShape: number,
    deviceName: string,
    keyNumber: number,
    deviceSource: number,
}
