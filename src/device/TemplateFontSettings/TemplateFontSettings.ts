import { ListView } from "../UiListView";
import { Component } from "../UiComponent";
import { SliderComponent } from "../UiSliderComponent";
import { BASE_FONT_SIZE } from "../UiProperties";
import { TextComponent } from "../UiTextComponent";
import { align } from "@zosx/ui";
import { Button, ButtonVariant } from "../UiButton";

export class TemplateFontSettings extends ListView<any> {
    private value: number = this.loadValue();
    private slider: SliderComponent = new SliderComponent({
        value: this.value,
        minValue: 10,
        maxValue: 50,
        onChange: (v) => this.useValue(v),
    });
    private preview: TextComponent = new TextComponent({
        text: this.i18n("Text will look like this"),
        textSize: this.value,
        alignH: align.CENTER_H,
        marginV: 4,
    });

    protected i18n(key: string) {
        // Override to bring translation mechanism
        return key;
    }

    protected build(): (Component<any> | null)[] {
        return [
            this.slider,
            this.preview,
            new Button({
                text: this.i18n("Restore default"),
                variant: ButtonVariant.DEFAULT,
                onClick: () => this.useValue(BASE_FONT_SIZE, true),
            })
        ];
    }

    protected saveValue(value: number) {
        localStorage.setItem("uiFontSize", value.toString());
    }

    protected loadValue(): number {
        const saved: string | null = localStorage.getItem("uiFontSize");
        if(!saved) return BASE_FONT_SIZE;
        return parseInt(saved);
    }

    private useValue(value: number, externalCall?: boolean) {
        if(externalCall) this.slider.updateProps({
            value: value
        });
        this.preview.updateProps({
            textSize: value,
        })
        this.saveValue(value);
    }
}