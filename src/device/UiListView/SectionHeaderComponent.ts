import {TextComponent} from "../UiTextComponent";
import {ICON_OFFSET} from "../UiProperties";

export class SectionHeaderComponent extends TextComponent {
    constructor(text: string) {
        super({text});
    }

    onInit() {
        if(!this.root) return;
        this.props = {
            textColor: this.root.theme.ACCENT_COLOR,
            textSize: this.root.theme.FONT_SIZE - 4,
            marginH: ICON_OFFSET,
            ...this.props,
        }
        super.onInit();
    }
}
