import { ZeppWidgetAlignMode, ZeppWidgetTextStyle } from "../../zosx/ui/Types";

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
