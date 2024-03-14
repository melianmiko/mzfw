import { BASE_FONT_SIZE, IS_MI_BAND_7 } from "../UiProperties";

export class UiTheme {
    FONT_SIZE: number = BASE_FONT_SIZE;

    ACCENT_COLOR: number = 0x1E88E5;
    ACCENT_COLOR_DARK: number = 0x072136;
    ACCENT_COLOR_LIGHT: number = 0x61a8e1;

    TEXT_COLOR: number = 0xFFFFFF;
    TEXT_COLOR_2: number = 0x999999;

    PAPER_NORMAL: number = IS_MI_BAND_7 ? 0x101010 : 0;
    PAPER_SELECTED: number = 0x333333;
    PAPER_PRESSED:  number = 0x444444;

    // TODO: Select better colors
    BUTTON_NORMAL: number = 0x111111;
    BUTTON_SELECTED: number =  0x222222;
    BUTTON_PRESSED: number = 0x0;
    BUTTON_DISABLED: number = 0x050505;
    BUTTON_TEXT: number = 0xFFFFFF;
}
