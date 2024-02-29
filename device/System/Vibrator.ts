import {createSensor} from "./index";

/**
 * Current `performVibration` timer
 */
let vibrationTimer: number = null;

/**
 * Vibrate sensor typing
 */
export type VibrationSensor = {
    scene: number;
    start(): void;
    stop(): void;
}

/**
 * hmSensor.type.VIBRATE, made global for global use )
 */
export const Vibrate: VibrationSensor = createSensor("Vibrator", "VIBRATE")

/**
 * Perform a vibration of provided scene for provided duration
 *
 * @param scene Vibration scene from ZeppOS docs
 * @param duration Duration until vibration will be stopped
 */
export function performVibration(scene: number, duration: number = 100) {
    if(vibrationTimer) return;
    Vibrate.stop();
    Vibrate.scene = scene;
    Vibrate.start();

    vibrationTimer = setTimeout(() => {
        Vibrate.stop();
        clearTimeout(vibrationTimer);
        vibrationTimer = null;
    }, duration);
}