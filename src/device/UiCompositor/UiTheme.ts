import { BASE_FONT_SIZE, IS_MI_BAND_7 } from "../UiProperties";

type UiThemeOptions = {
    useFontSetting?: boolean,
}

export class UiTheme {
    FONT_SIZE: number = BASE_FONT_SIZE;

    ACCENT_COLOR: number = 0x1E88E5;
    ACCENT_COLOR_DARK: number = 0x072136;
    ACCENT_COLOR_DARK_2: number = 0x061926;
    ACCENT_COLOR_LIGHT: number = 0x61a8e1;

    TEXT_COLOR: number = 0xFFFFFF;
    TEXT_COLOR_2: number = 0x999999;

    PAPER_NORMAL: number = IS_MI_BAND_7 ? 0x1f1f1f : 0;
    PAPER_SELECTED: number = 0x333333;
    PAPER_PRESSED:  number = IS_MI_BAND_7 ? 0x0f0f0f : 0x444444;

    BUTTON_NORMAL: number = 0x1f1f1f;
    BUTTON_SELECTED: number =  0x333333;
    BUTTON_PRESSED: number = 0x0f0f0f;
    BUTTON_DISABLED: number = 0x0f0f0f;
    BUTTON_TEXT: number = 0xFFFFFF;

    KBD_BUTTON_BG_NORMAL: number = 0x0;
    KBD_BUTTON_BG_SPECIAL: number = 0x0;
    KBD_BUTTON_BG_PRESSED: number = 0x111111;
    KBD_BUTTON_TEXT_NORMAL: number = 0xFFFFFF;
    KBD_BUTTON_TEXT_SPECIAL: number = 0xAAAAAA;
    KBD_SPACE_BG: number = 0x333333;
    KBD_SPACE_BG_PRESSED: number = 0x555555;
    KBD_SPACE_TEXT: number = 0x999999;
    KBD_SPACE_SIZE_DELTA: number = 8;

    constructor(options?: UiThemeOptions) {
        if(!options) return;
        if(options.useFontSetting) {
            const fontSize = localStorage.getItem("uiFontSize");
            if(fontSize) this.FONT_SIZE = parseInt(fontSize);
        }
    }
}
