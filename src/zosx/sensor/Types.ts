export type VibratorScenes = {
    VIBRATOR_SCENE_SHORT_LIGHT: number,
    VIBRATOR_SCENE_SHORT_MIDDLE: number,
    VIBRATOR_SCENE_SHORT_STRONG: number,
    VIBRATOR_SCENE_DURATION: number,
    VIBRATOR_SCENE_DURATION_LONG: number,
    VIBRATOR_SCENE_STRONG_REMINDER: number,
    VIBRATOR_SCENE_NOTIFICATION: number,
    VIBRATOR_SCENE_CALL: number,
    VIBRATOR_SCENE_TIMER: number
}

export abstract class ZeppVibratorSensor {
    abstract start(scene?: number): void;
    abstract stop(): void;
    abstract setMode(scene: number): void;
    abstract getConfig(): number;
}
