export type ZeppDisplayLibrary = {
    getAutoBrightness(): boolean;
    getBrightness(): number;
    pauseDropWristScreenOff(options: {duration: number}): number;
    pausePalmScreenOff(options: {duration: number}): number;
    resetDropWristScreenOff(): number;
    resetPageBrightTime(): number;
    resetPalmScreenOff(): number;
    setAutoBrightness(options: {autoBright: boolean}): void;
    setBrightness(options: {brightness: number}): number;
    setPageBrightTime(options: {brightTime: number}): number;
    setScreenOff(): number;
    setWakeUpRelaunch(options: {relaunch: boolean}): void;
}

export type ZeppLegacyDisplayRelatedSettings = {
    getScreenAutoBright(): boolean;
    getBrightness(): number;
    setBrightScreen(seconds: number): number;
    setBrightScreenCancel(): number;
    setScreenAutoBright(value: boolean): number;
    setBrightness(value: number): number;
    setScreenOff(): number;
}

export type ZeppLegacyDisplayRelatedApp = {
    setScreenKeep(option: boolean): void;
}