import { ScreenBoardQWERTY } from "./ScreenBoardQWERTY";
import { SB_T14_LAYOUTS, SB_T14_SYMBOLS_SUB_SCREEN } from "../data/T14";
import { ScreenBoard } from "../ScreenBoard";

export class ScreenBoardT14 extends ScreenBoardQWERTY {
    protected symbolsData = SB_T14_SYMBOLS_SUB_SCREEN;
    protected layoutData = SB_T14_LAYOUTS;
    protected buttonCounts = [5, 5, 4];
    constructor(board: ScreenBoard) {
        super(board);
        this.symbolsData = SB_T14_SYMBOLS_SUB_SCREEN;
        this.layoutData = SB_T14_LAYOUTS;
        this.buttonCounts = [5, 5, 4];
    }
}
