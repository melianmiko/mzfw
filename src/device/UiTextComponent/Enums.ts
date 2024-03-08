import {systemUi} from "../System";

/**
 * Available text align options
 */
export enum Align {
    LEFT = systemUi.align.LEFT,
    CENTER_H = systemUi.align.CENTER_H,
    RIGHT = systemUi.align.RIGHT,

    TOP = systemUi.align.TOP,
    CENTER_V = systemUi.align.CENTER_V,
    BOTTOM = systemUi.align.BOTTOM,
}

/**
 * Available text style options
 */
export enum TextStyle {
    /**
     * Text will be scrolling in one row
     */
    NONE = systemUi.text_style.NONE,
    /**
     * Text will wrap per word
     */
    WRAP = systemUi.text_style.WRAP,
    /**
     * Text will wrap per character
     */
    CHAR_WRAP = systemUi.text_style.CHAR_WRAP,
    /**
     * Text will be cropped to fit one line ("Text will...")
     */
    ELLIPSIS = systemUi.text_style.ELLIPSIS,
}