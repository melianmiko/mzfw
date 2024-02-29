import {TextComponent} from "../UiTextComponent";
import {Theme} from "../UiComponent";

export class SectionHeaderComponent extends TextComponent {
    constructor(text: string) {
        super({text});
    }

    onInit() {
        this.props = {
            color: Theme.ACCENT_COLOR,
            textSize: this.root.baseFontSize - 4,
            ...this.props,
        }
        super.onInit();
    }
}