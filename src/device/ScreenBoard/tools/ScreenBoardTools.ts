import { DEVICE_SHAPE, SCREEN_WIDTH } from "../../UiProperties";
import { SB_ICON_SIZE, SB_ROW_HEIGHT, SB_SCREEN_ROUND_DELTA, SB_VIEWPORT_HEIGHT } from "./ScreenBoardConstants";
import { CapsState } from "../Enums";
import { getLanguageString } from "@zosx/utils";

export function getFallbackLayouts(knownLayouts: string[]): string[] {
    const userLang = getLanguageString();
    // console.log(`[sb] userLang=${userLang}`);
    if(knownLayouts.indexOf(userLang) < 0 || userLang == "en-US")
        return ["en-US"];
    else
        return [userLang, "en-US"];
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
