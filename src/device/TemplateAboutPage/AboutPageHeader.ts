import { Component } from "../UiComponent";
import { AboutPageHeaderProps } from "./Types";
import { IHmUIWidget, systemUi } from "../System";
import { DEVICE_SHAPE, SCREEN_MARGIN, WIDGET_WIDTH } from "../UiProperties";

export class AboutPageHeader extends Component<AboutPageHeaderProps> {
    private titleView: IHmUIWidget;
    private versionView: IHmUIWidget;
    private iconView: IHmUIWidget;

    protected onRender() {
        if(DEVICE_SHAPE == "band") return this.onRenderBand();
        this.iconView = systemUi.createWidget(systemUi.widget.IMG, {
            x: SCREEN_MARGIN + this.geometry.x,
            y: this.geometry.y,
            src: this.props.iconPath,
        });
        this.titleView = systemUi.createWidget(systemUi.widget.TEXT, {
            x: SCREEN_MARGIN + this.geometry.x + 96,
            y: this.geometry.y,
            w: this.geometry.w - SCREEN_MARGIN - 88,
            color: 0xFFFFFF,
            text: this.props.name,
            text_style: systemUi.text_style.NONE,
            text_size: this.root.theme.FONT_SIZE,
        })
        this.versionView = systemUi.createWidget(systemUi.widget.TEXT, {
            x: SCREEN_MARGIN + this.geometry.x + 96,
            y: this.geometry.y + (this.root.theme.FONT_SIZE * 1.4),
            w: this.geometry.w - SCREEN_MARGIN - 88,
            color: 0xaaaaaa,
            text: this.props.version,
            text_style: systemUi.text_style.NONE,
            text_size: this.root.theme.FONT_SIZE - 4,
        })
    }

    protected onRenderBand() {
        this.iconView = systemUi.createWidget(systemUi.widget.IMG, {
            x: this.geometry.x + Math.floor((this.geometry.w - 80) / 2),
            y: this.geometry.y,
            src: this.props.iconPath,
        });
        this.titleView = systemUi.createWidget(systemUi.widget.TEXT, {
            x: 0,
            y: this.geometry.y + 96,
            w: this.geometry.w,
            color: 0xFFFFFF,
            text: this.props.name,
            align_h: systemUi.align.CENTER_H,
            text_style: systemUi.text_style.NONE,
            text_size: this.root.theme.FONT_SIZE,
        })
        this.versionView = systemUi.createWidget(systemUi.widget.TEXT, {
            x: 0,
            y: this.geometry.y + 96 + (this.root.theme.FONT_SIZE * 1.4),
            w: this.geometry.w,
            color: 0xaaaaaa,
            text: this.props.version,
            align_h: systemUi.align.CENTER_H,
            text_style: systemUi.text_style.NONE,
            text_size: this.root.theme.FONT_SIZE - 4,
        })
    }

    protected onDestroy() {
        systemUi.deleteWidget(this.iconView);
        systemUi.deleteWidget(this.titleView);
        systemUi.deleteWidget(this.versionView);
    }

    protected getAutoHeight(): number {
        return DEVICE_SHAPE == "band" ? 160 : 112;
    }
}
