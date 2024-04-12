import { isLegacyAPI, osImport } from "../internal";
import { ZeppDisplayLibrary, ZeppLegacyDisplayRelatedApp, ZeppLegacyDisplayRelatedSettings } from "./Types";

const modernApi = osImport<ZeppDisplayLibrary>("@zos/display", null);
const legacySetting = osImport<ZeppLegacyDisplayRelatedSettings>("@zos/settings", "hmSetting");

const legacyWrapper: ZeppDisplayLibrary = {
    getAutoBrightness: function (): boolean {
        return legacySetting.getScreenAutoBright();
    },
    getBrightness: function (): number {
        return legacySetting.getBrightness();
    },
    pauseDropWristScreenOff: function (options: { duration: number; }): number {
        return 1;
    },
    pausePalmScreenOff: function (options: { duration: number; }): number {
        return 1;
    },
    resetDropWristScreenOff: function (): number {
        return 1;
    },
    resetPageBrightTime: function (): number {
        return legacySetting.setBrightScreenCancel();
    },
    resetPalmScreenOff: function (): number {
        return 1;
    },
    setAutoBrightness: function (options: { autoBright: boolean; }): void {
        legacySetting.setScreenAutoBright(options.autoBright);
    },
    setBrightness: function (options: { brightness: number; }): number {
        return legacySetting.setBrightness(options.brightness);
    },
    setPageBrightTime: function (options: { brightTime: number; }): number {
        return legacySetting.setBrightScreen(Math.floor(options.brightTime / 1000));
    },
    setScreenOff: () => legacySetting.setScreenOff(),
    setWakeUpRelaunch: function (options: { relaunch: boolean; }): void {
        const hmApp = osImport<ZeppLegacyDisplayRelatedApp>(null, "hmApp");
        hmApp.setScreenKeep(options.relaunch);
    }
}

export const {
    getAutoBrightness,
    pauseDropWristScreenOff,
    resetDropWristScreenOff,
    getBrightness,
    setScreenOff,
    pausePalmScreenOff,
    setWakeUpRelaunch,
    resetPageBrightTime,
    resetPalmScreenOff,
    setPageBrightTime,
    setBrightness,
    setAutoBrightness,
} = isLegacyAPI ? legacyWrapper : modernApi;
