import { ButtonVariant } from "./Enums";
import { PaperWidgetProps } from "../UiPaperComponent";

export interface ButtonProps extends PaperWidgetProps {
    text: string;
    variant: ButtonVariant;
    onClick?(): any;
}

export interface HeadlineButtonProps {
    text: string;
    icon: string;
    textColor?: number,
    onClick?(): any;
}
