import { ScreenBoardQWERTY } from "./ScreenBoardQWERTY";
import { SB_T14_SYMBOLS_SUB_SCREEN } from "../data/T14";

export class ScreenBoardT14 extends ScreenBoardQWERTY {
    protected rendererId: string = "t14";
    protected symbolsData = SB_T14_SYMBOLS_SUB_SCREEN;
    protected buttonCounts = [5, 5, 4];
}
