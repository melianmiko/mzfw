import {Align, TextStyle} from "./Enums";

export type TextComponentProps = {
    text: string,
    color?: number,
    alignH?: Align,
    alignV?: Align,
    marginH?: number,
    marginV?: number,
    textSize?: number,
    textStyle?: TextStyle,
};
