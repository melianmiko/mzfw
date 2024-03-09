import { isLegacyAPI } from "../internal";
import { ZeppVibratorSensor, VibratorScenes } from "./Types";
import { legacyHmSensor } from "./NativeLegacy";
import { modernHmSensor } from "./NativeModern";

interface LegacyVibrateSensor {
    start(scene?: number): void;
    stop(): void;
    scene: number,
}

class LegacyVibrator extends ZeppVibratorSensor {
    private vibrator: LegacyVibrateSensor = legacyHmSensor.createSensor<LegacyVibrateSensor>(legacyHmSensor.id.VIBRATE);

    start(scene?: number) {
        this.vibrator.start(scene);
    }

    stop() {
        this.vibrator.stop();
    }

    setMode(scene: number) {
        this.vibrator.scene = scene;
    }

    getConfig(): number {
        return this.vibrator.scene;
    }
}


export const Vibrator: { new(): ZeppVibratorSensor } = isLegacyAPI ? LegacyVibrator : modernHmSensor.Vibrator;
export const {
    VIBRATOR_SCENE_SHORT_LIGHT,
    VIBRATOR_SCENE_DURATION,
    VIBRATOR_SCENE_DURATION_LONG,
    VIBRATOR_SCENE_NOTIFICATION,
    VIBRATOR_SCENE_SHORT_MIDDLE,
    VIBRATOR_SCENE_SHORT_STRONG,
    VIBRATOR_SCENE_STRONG_REMINDER,
    VIBRATOR_SCENE_CALL,
    VIBRATOR_SCENE_TIMER
} = isLegacyAPI ? {
    VIBRATOR_SCENE_SHORT_LIGHT: 23,
    VIBRATOR_SCENE_SHORT_MIDDLE: 24,
    VIBRATOR_SCENE_SHORT_STRONG: 25,
    VIBRATOR_SCENE_DURATION: 28,
    VIBRATOR_SCENE_DURATION_LONG: 27,
    VIBRATOR_SCENE_STRONG_REMINDER: 9,
    VIBRATOR_SCENE_NOTIFICATION: 0,
    VIBRATOR_SCENE_CALL: 1,
    VIBRATOR_SCENE_TIMER: 5
} : modernHmSensor;
