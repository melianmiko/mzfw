import {Align, TextStyle} from "./Enums";

export type TextWidgetProps = {
    text: string,
    color?: number,
    alignH?: Align,
    alignV?: Align,
    textSize?: number,
    textStyle?: TextStyle,
};
