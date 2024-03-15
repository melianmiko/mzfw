import { ScreenBoard } from "./ScreenBoard";
import { ZeppWidget } from "../../zosx/ui/Types";
import { ZeppTextWidgetOptions } from "../../zosx/ui/WidgetOptionTypes";
import { ScreenBoardLayoutsCollection } from "./Interfaces";
import { CapsState } from "./Enums";
import { prop } from "../../zosx/ui";

export class ScreenBoardButtonsManager {
    public layout: string = "";
    public isSubScreen: boolean = false;

    private readonly board: ScreenBoard;
    private readonly inputButtons: ZeppWidget<ZeppTextWidgetOptions, {}>[];
    private readonly layoutData: ScreenBoardLayoutsCollection;
    private noAutoExit: boolean = false;
    private subScreenData: string[] = [];

    constructor(
        board: ScreenBoard,
        inputButtons: ZeppWidget<ZeppTextWidgetOptions, {}>[],
        layoutData: ScreenBoardLayoutsCollection
    ) {
        this.board = board;
        this.inputButtons = inputButtons;
        this.layoutData = layoutData;

        this.onButtonPress = this.onButtonPress.bind(this);
    }

    useLayout(name: string) {
        const data = this.layoutData[name];
        if(!data) throw new Error(`Layout not found: ${name}`);

        this.layout = name;
        this.isSubScreen = false;

        const isCapsUp = this.board.capsState != CapsState.CAPS_OFF;
        for(let i = 0; i < this.inputButtons.length; i++) {
            let text: string = "";
            if(i < data.length) {
                text = data[i].title ?? data[i].values.join("").substring(0, 3)
                if(isCapsUp) text = text.toUpperCase();
            }
            this.inputButtons[i].setProperty(prop.TEXT, text.replace(" ", "_"));
        }
    }

    joinSubScreen(data: string[], noAutoExit: boolean = false) {
        if(!Array.isArray(data))
            data = data[Object.keys(data)[0]];

        this.subScreenData = data;
        this.isSubScreen = true;
        this.noAutoExit = noAutoExit;
        const isCapsUp = this.board.capsState != CapsState.CAPS_OFF;
        for(let i = 0; i < this.inputButtons.length; i++) {
            let text: string = "";
            if(i < data.length) {
                text = data[i];
                if(isCapsUp) text = text.toUpperCase();
            }
            this.inputButtons[i].setProperty(prop.TEXT, text.replace(" ", "_"));
        }
    }

    onButtonPress(ident: number) {
        if(this.isSubScreen) {
            let data: string = ident < this.subScreenData.length ? this.subScreenData[ident] : "";
            if(this.board.capsState !== CapsState.CAPS_OFF) data = data.toUpperCase();

            this.board.value += data;
            if(!this.noAutoExit)
                this.useLayout(this.layout);
            return;
        }

        const values: string[] = this.layoutData[this.layout][ident].values;
        if(values.length > 1) {
            // Run sub-screen
            this.joinSubScreen(values);
        } else {
            let val = values[0];
            if(this.board.capsState !== CapsState.CAPS_OFF)
                val = val.toUpperCase();
            this.board.value += val;
        }
    }
}
