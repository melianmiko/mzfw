import { osImport } from "../internal";
import { VibratorScenes, ZeppVibratorSensor } from "./Types";


export type ModernHmSensor = VibratorScenes & {
    Vibrator: {new(): ZeppVibratorSensor},
}

export const modernHmSensor = osImport<ModernHmSensor>("@zos/sensor", null);
