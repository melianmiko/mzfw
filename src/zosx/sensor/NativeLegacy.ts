import { osImport } from "../internal";

export const legacyHmSensor: LegacyHmSensor = osImport<LegacyHmSensor>(null, "hmSensor");

export interface LegacyHmSensor {
    createSensor<T>(id: ZeppLegacySensorID): T;
    id: ZeppLegacySensorID;
}

export type ZeppLegacySensorID = {
    BATTERY: ZeppLegacySensorID,
    STEP: ZeppLegacySensorID,
    CALORIE: ZeppLegacySensorID,
    HEART: ZeppLegacySensorID,
    PAI: ZeppLegacySensorID,
    DISTANCE: ZeppLegacySensorID,
    STAND: ZeppLegacySensorID,
    WEATHER: ZeppLegacySensorID,
    ACTIVITY: ZeppLegacySensorID,
    FAT_BURRING: ZeppLegacySensorID,
    FAT_BURNING: ZeppLegacySensorID,
    SUN: ZeppLegacySensorID,
    WIND: ZeppLegacySensorID,
    STRESS: ZeppLegacySensorID,
    SPO2: ZeppLegacySensorID,
    BODY_TEMP: ZeppLegacySensorID,
    PRESS: ZeppLegacySensorID,
    TIME: ZeppLegacySensorID,
    VIBRATE: ZeppLegacySensorID,
    WEAR: ZeppLegacySensorID,
    WORLD_CLOCK: ZeppLegacySensorID,
    MUSIC: ZeppLegacySensorID,
    SLEEP: ZeppLegacySensorID,
    SPORT: ZeppLegacySensorID,
    // Typo in firmware, nothing interesting
    // noinspection SpellCheckingInspection
    BPRESSURE: ZeppLegacySensorID,
}
