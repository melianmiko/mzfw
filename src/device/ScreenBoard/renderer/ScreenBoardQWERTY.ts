import { ScreenBoardLayoutsCollection, ScreenBoardRenderer } from "../Interfaces";
import { ScreenBoard } from "../ScreenBoard";
import { ZeppWidget } from "../../../zosx/ui/Types";
import { ZeppButtonWidgetOptions, ZeppTextWidgetOptions } from "../../../zosx/ui/WidgetOptionTypes";
import { SB_QWERTY_LAYOUTS, SB_QWERTY_SYMBOLS_SUBSCREEN } from "../data/QWERTY";
import { getScreenBoardCapsIcon, getScreenBoardRowPosition } from "../ScreenBoardTools";
import { prop } from "../../../zosx/ui";
import { ScreenBoardButtonsManager } from "../ScreenBoardButtonsManager";
import { SB_ACT_BUTTON_WIDTH } from "../ScreenBoardConstants";

export class ScreenBoardQWERTY implements ScreenBoardRenderer {
    public extraLayouts: string[] = [];
    public hasBackspace: boolean = true;

    protected readonly layoutData: ScreenBoardLayoutsCollection = SB_QWERTY_LAYOUTS;
    protected readonly symbolsData: string[] = SB_QWERTY_SYMBOLS_SUBSCREEN;
    protected readonly buttonCounts: number[] = [10, 9, 7];

    private readonly inputButtons: ZeppWidget<ZeppTextWidgetOptions, {}>[] = [];
    private readonly board: ScreenBoard;
    private readonly manager: ScreenBoardButtonsManager;
    private capsButton: ZeppWidget<ZeppButtonWidgetOptions, {}> | null = null;
    private symbolsBtn: ZeppWidget<ZeppButtonWidgetOptions, {}> | null = null;
    private spaceBtn: ZeppWidget<ZeppButtonWidgetOptions, {}> | null = null;

    constructor(board: ScreenBoard) {
        this.board = board;
        this.manager = new ScreenBoardButtonsManager(this.board, this.inputButtons, this.layoutData);
    }

    build() {
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
        if(this.manager.isSubScreen)
            return this.manager.useLayout(this.manager.layout);
        this.manager.joinSubScreen(this.symbolsData, true);
    }

    private addSpace() {
        if(this.manager.isSubScreen)
            this.manager.useLayout(this.manager.layout);
        this.board.value += " ";
    }

    useLayout(name: string) {
        if(this.capsButton) this.capsButton.setProperty(prop.SRC, getScreenBoardCapsIcon(this.board.capsState));
        if(this.spaceBtn) this.spaceBtn.setProperty(prop.TEXT, name.toUpperCase());

        return this.manager.useLayout(name);
    }
}
