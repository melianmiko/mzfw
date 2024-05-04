import { ZeppWidgetAlignMode, ZeppWidgetTextStyle } from "@zosx/types";

export type TextComponentProps = {
    text: string,
    color?: number,
    alignH?: ZeppWidgetAlignMode,
    alignV?: ZeppWidgetAlignMode,
    marginH?: number,
    marginV?: number,
    textSize?: number,
    textStyle?: ZeppWidgetTextStyle,
};
