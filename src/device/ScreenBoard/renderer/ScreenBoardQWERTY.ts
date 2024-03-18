import { ScreenBoardLayout, ScreenBoardLayoutsCollection, ScreenBoardRenderer } from "../Interfaces";
import { ScreenBoard } from "../ScreenBoard";
import { ZeppWidget } from "../../../zosx/ui/Types";
import { ZeppButtonWidgetOptions, ZeppTextWidgetOptions } from "../../../zosx/ui/WidgetOptionTypes";
import { SB_QWERTY_SYMBOLS_SUB_SCREEN } from "../data/QWERTY";
import { getScreenBoardCapsIcon, getScreenBoardRowPosition } from "../tools/ScreenBoardTools";
import { prop } from "../../../zosx/ui";
import { ScreenBoardButtonsManager } from "../tools/ScreenBoardButtonsManager";
import { SB_ACT_BUTTON_WIDTH } from "../tools/ScreenBoardConstants";
import { SB_COMPILED_LAYOUTS } from "../tools/ScreenBoardCompiledData";

export class ScreenBoardQWERTY implements ScreenBoardRenderer {
    public extraLayouts: string[] = [];
    public hasBackspace: boolean = true;

    protected rendererId: string = "qwerty";
    protected buttonCounts: number[] = [10, 9, 7];
    protected symbolsData: ScreenBoardLayout = SB_QWERTY_SYMBOLS_SUB_SCREEN;

    private readonly inputButtons: ZeppWidget<ZeppTextWidgetOptions, {}>[] = [];
    private readonly board: ScreenBoard;
    private manager: ScreenBoardButtonsManager | null = null;
    private capsButton: ZeppWidget<ZeppButtonWidgetOptions, {}> | null = null;
    private symbolsBtn: ZeppWidget<ZeppButtonWidgetOptions, {}> | null = null;
    private spaceBtn: ZeppWidget<ZeppButtonWidgetOptions, {}> | null = null;

    constructor(board: ScreenBoard) {
        this.board = board;
    }

    build() {
        this.manager = new ScreenBoardButtonsManager(this.board, this.inputButtons, SB_COMPILED_LAYOUTS[this.rendererId]);

        // First rows
        for(let i = 0; i < 3; i++) {
            let [x, y, w] = getScreenBoardRowPosition(i);
            if(i === 2) {
                x += SB_ACT_BUTTON_WIDTH;
                w -= SB_ACT_BUTTON_WIDTH * 2;
            }

            const count = this.buttonCounts[i];
            const buttonWidth = Math.round(w / count);

            for(let i = 0; i < count; i++) {
                const btn = this.board.createTextButton({
                    x: x + i * buttonWidth,
                    y,
                    w: buttonWidth,
                    ident: this.inputButtons.length,
                    handler: this.manager.onButtonPress,
                });
                this.inputButtons.push(btn);
            }
        }

        // Caps & backspace button
        let [x, y, w] = getScreenBoardRowPosition(2);
        this.capsButton = this.board.createIconButton({
            x, y,
            w: SB_ACT_BUTTON_WIDTH,
            icon: "caps_off",
            handler: this.board.toggleCaps.bind(this.board),
            ident: 0,
        });
        this.board.createIconButton({
            x: x + w - SB_ACT_BUTTON_WIDTH,
            y,
            w: SB_ACT_BUTTON_WIDTH,
            icon: "backspace",
            ident: 0,
            handler: this.board.doBackspace.bind(this.board),
        });

        // Space bar & symbols switch
        [x, y, w] = getScreenBoardRowPosition(3);

        this.symbolsBtn = this.board.createTextButton({
            x, y,
            w: 64,
            ident: 0,
            handler: this.toggleSymbols.bind(this),
            special: true
        });
        this.symbolsBtn.setProperty(prop.TEXT, "1!?");

        this.board.createIconButton({
            x: x + 64,
            y,
            w: 64,
            icon: "lang",
            ident: 0,
            handler: this.board.switchLayout.bind(this.board),
        });
        this.spaceBtn = this.board.createSpaceButton({
            x: x + 128,
            y,
            w: w - 192,
            handler: this.addSpace.bind(this),
        });

        this.inputButtons.push(this.board.createTextButton({
            x: x + w - 64,
            y,
            w: 64,
            ident: this.inputButtons.length,
            handler: this.manager.onButtonPress.bind(this.manager),
            special: true,
        }));
    }

    private toggleSymbols() {
        if(!this.manager) return;

        if(this.manager.isSubScreen)
            return this.manager.useLayout(this.manager.layout);
        if(this.manager.layout == "symbols")
            this.manager.leaveTemporaryLayout()
        else
            this.manager.useLayoutData("symbols", this.symbolsData, true);
    }

    private addSpace() {
        if(this.manager) {
            if(this.manager.layout == "symbols")
                this.manager.leaveTemporaryLayout();
            if(this.manager.isSubScreen)
                this.manager.useLayout(this.manager.layout);
        }
        this.board.value += " ";
    }

    useLayout(name: string) {
        if(!this.manager) return;

        if(this.capsButton) this.capsButton.setProperty(prop.SRC, getScreenBoardCapsIcon(this.board.capsState));
        if(this.spaceBtn) this.spaceBtn.setProperty(prop.TEXT, name.toUpperCase());

        return this.manager.useLayout(name);
    }
}
