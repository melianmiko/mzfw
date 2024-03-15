import type { ScreenBoard } from "./ScreenBoard";
import type { ScreenBoardRenderer } from "./Interfaces";
import { DEVICE_SHAPE, SCREEN_WIDTH } from "../UiProperties";
import { SB_ROW_HEIGHT, SB_SCREEN_ROUND_DELTA, SB_VIEWPORT_HEIGHT } from "./ScreenBoardConstants";
import { ScreenBoardQWERTY } from "./renderer/ScreenBoardQWERTY";
import { CapsState } from "./Enums";

export function getScreenBoardRenderer(board: ScreenBoard, forceRenderer: string | undefined): ScreenBoardRenderer {
    // TODO
    return new ScreenBoardQWERTY(board);
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
        return "caps_mid";
    case CapsState.CAPS_ON:
        return "caps_on";
    default:
        return "caps_off";
    }
}
