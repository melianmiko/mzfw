import type { ScreenBoard } from "../ScreenBoard";
import type { ScreenBoardRenderer } from "../Interfaces";
import { DEVICE_SHAPE, SCREEN_WIDTH } from "../../UiProperties";
import { SB_ICON_SIZE, SB_ROW_HEIGHT, SB_SCREEN_ROUND_DELTA, SB_VIEWPORT_HEIGHT } from "./ScreenBoardConstants";
import { ScreenBoardQWERTY } from "../renderer/ScreenBoardQWERTY";
import { CapsState } from "../Enums";
import { ScreenBoardT9 } from "../renderer/ScreenBoardT9";
import { ScreenBoardT14 } from "../renderer/ScreenBoardT14";

export function getScreenBoardRenderer(board: ScreenBoard): ScreenBoardRenderer {
    const renderer = board.getCurrentRendererName();
    switch (renderer) {
    case "t9":
        return new ScreenBoardT9(board);
    case "t14":
        return new ScreenBoardT14(board);
    case "qwerty":
        return new ScreenBoardQWERTY(board);
    default:
        console.log(`[sb] warn: unknown renderer ${renderer}`);
        return new ScreenBoardT9(board);
    }
}

export function getScreenBoardRowPosition(i: number): [number, number, number] {
    return [
        DEVICE_SHAPE == "circle" ? i * SB_SCREEN_ROUND_DELTA * SCREEN_WIDTH : 0,
        SB_VIEWPORT_HEIGHT + i * SB_ROW_HEIGHT,
        SCREEN_WIDTH * (1 - (DEVICE_SHAPE == "circle" ? i * SB_SCREEN_ROUND_DELTA * 2 : 0))
    ];
}

export function getScreenBoardCapsIcon(state: CapsState): string {
    switch(state) {
    case CapsState.CAPS_ONE_TIME:
        return `mzfw/${SB_ICON_SIZE}/caps_mid.png`;
    case CapsState.CAPS_ON:
        return `mzfw/${SB_ICON_SIZE}/caps_on.png`;
    default:
        return `mzfw/${SB_ICON_SIZE}/caps_off.png`;
    }
}
