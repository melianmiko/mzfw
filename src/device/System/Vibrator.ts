import { Vibrator } from "@zosx/sensor";

/**
 * Current `performVibration` timer
 */
let vibrationTimer: NodeJS.Timeout | null = null;


/**
 * hmSensor.type.VIBRATE, made global for global use )
 */
export const vibrator = new Vibrator();

/**
 * Perform a vibration of provided scene for provided duration
 *
 * @param scene Vibration scene from ZeppOS docs
 * @param duration Duration until vibration will be stopped
 */
export function performVibration(scene: number, duration: number = 100) {
    if(vibrationTimer) return;
    vibrator.stop();
    vibrator.setMode(scene);
    vibrator.start();

    vibrationTimer = setTimeout(() => {
        vibrator.stop();
        if(vibrationTimer)
            clearTimeout(vibrationTimer);
        vibrationTimer = null;
    }, duration);
}
