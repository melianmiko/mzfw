import { ScreenBoard } from "../ScreenBoard";
import { ScreenBoardRenderer } from "../Interfaces";
import { ZeppWidget } from "../../../zosx/ui/Types";
import { ZeppImgWidgetOptions, ZeppTextWidgetOptions } from "../../../zosx/ui/WidgetOptionTypes";
import { ScreenBoardButtonsManager } from "../ScreenBoardButtonsManager";
import { getScreenBoardCapsIcon, getScreenBoardRowPosition } from "../ScreenBoardTools";
import { prop } from "../../../zosx/ui";
import { SB_T9_LAYOUTS } from "../data/T9";

export class ScreenBoardT9 implements ScreenBoardRenderer {
    hasBackspace: boolean = false;
    extraLayouts: string[] = ["numbers"];

    private readonly board: ScreenBoard;
    private readonly inputButtons: ZeppWidget<ZeppTextWidgetOptions, {}>[] = [];
    private readonly manager: ScreenBoardButtonsManager;
    private capsButton: ZeppWidget<ZeppImgWidgetOptions, {}> | null = null;

    constructor(board: ScreenBoard) {
        this.board = board;
        this.manager = new ScreenBoardButtonsManager(board, this.inputButtons, SB_T9_LAYOUTS);
    }

    build() {
        // 1-9 btns
        for(let i = 0; i < 3; i++) {
            const [x, y, w] = getScreenBoardRowPosition(i);
            const buttonWidth = Math.floor(w / 3);
            for(let j = 0; j < 3; j++) {
                const btn = this.board.createTextButton({
                    x: x + j * buttonWidth,
                    y,
                    w: buttonWidth,
                    ident: i * 3 + j,
                    handler: this.manager.onButtonPress,
                })
                this.inputButtons.push(btn);
            }
        }

        // Last row
        const [x, y, w] = getScreenBoardRowPosition(3);
        const buttonWidth = Math.floor(w / 3);
        this.capsButton = this.board.createIconButton({
            x, y,
            w: buttonWidth,
            icon: "",
            ident: 0,
            handler: this.board.toggleCaps
        });
        this.board.createIconButton({
            x: x + buttonWidth * 2,
            y,
            w: buttonWidth,
            icon: "lang",
            ident: 0,
            handler: this.board.switchLayout,
        });

        this.board.createSpaceButton({
            x: x + buttonWidth,
            y,
            w: buttonWidth,
            handler: this.addSpace.bind(this),
        })
    }

    private addSpace() {
        if(this.manager) {
            if(this.manager.isSubScreen)
                this.manager.useLayout(this.manager.layout);
        }
        this.board.value += " ";
    }

    useLayout(name: string) {
        this.capsButton?.setProperty(prop.SRC, getScreenBoardCapsIcon(this.board.capsState));
        return this.manager.useLayout(name);
    }
}
