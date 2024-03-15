import { DEVICE_SHAPE, IS_BAND_7, IS_MI_BAND_7, IS_SMALL_SCREEN_DEVICE, SCREEN_HEIGHT } from "../UiProperties";

export const SB_CONFIRM_BUTTON_HEIGHT = IS_MI_BAND_7 ? 96 : 56;
export const SB_ROW_HEIGHT = ((): number => {
    if(SCREEN_HEIGHT > 450) return 60;
    return IS_SMALL_SCREEN_DEVICE ? 48 : 56;
})();
export const SB_ACT_BUTTON_WIDTH = IS_SMALL_SCREEN_DEVICE ? 32 : 48;
export const SB_FONT_DELTA = (IS_SMALL_SCREEN_DEVICE && !IS_BAND_7) ? -6 : 0;
export const SB_SCREEN_ROUND_DELTA = IS_SMALL_SCREEN_DEVICE ? 0.03 : 0.04;
export const SB_VIEWPORT_HEIGHT = SCREEN_HEIGHT - (SB_ROW_HEIGHT * 4) - SB_CONFIRM_BUTTON_HEIGHT;
export const SB_ICON_SIZE = ((): number => {
    if(DEVICE_SHAPE == "band") return 24;
    return IS_SMALL_SCREEN_DEVICE ? 32 : 48;
})()
