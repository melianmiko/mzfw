import { ScreenBoard } from "../ScreenBoard";
import { ZeppTextWidgetOptions, ZeppWidget } from "@zosx/types";
import { ScreenBoardLayout, ScreenBoardLayoutsCollection } from "../Interfaces";
import { CapsState } from "../Enums";
import { prop } from "@zosx/ui";

export class ScreenBoardButtonsManager {
    public layout: string = "";
    public isSubScreen: boolean = false;

    private readonly board: ScreenBoard;
    private readonly inputButtons: ZeppWidget<ZeppTextWidgetOptions, {}>[];
    private readonly layoutData: ScreenBoardLayoutsCollection;
    private currentData: ScreenBoardLayout = [];
    private prevLayout: string = "";
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
        this.useLayoutData(name, data);
    }

    useLayoutData(name: string, data: ScreenBoardLayout, temporary: boolean = false) {
        if(temporary && !this.prevLayout) {
            this.prevLayout = this.layout;
        }

        this.layout = name;
        this.currentData = data;
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

    leaveTemporaryLayout() {
        this.useLayout(this.prevLayout);
        this.prevLayout = "";
    }

    private joinSubScreen(data: string[]) {
        if(!Array.isArray(data))
            data = data[Object.keys(data)[0]];

        this.subScreenData = data;
        this.isSubScreen = true;
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
            this.useLayoutData(this.layout, this.currentData);
            return;
        }

        const values: string[] = this.currentData[ident].values;
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
