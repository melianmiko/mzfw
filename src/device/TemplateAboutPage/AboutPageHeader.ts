import { Component } from "../UiComponent";
import { AboutPageHeaderProps } from "./Types";
import { DEVICE_SHAPE, SCREEN_MARGIN } from "../UiProperties";
import { ZeppImgWidgetOptions, ZeppTextWidgetOptions, ZeppWidget } from "@zosx/types";
import { align, createWidget, deleteWidget, text_style, widget } from "@zosx/ui";

export class AboutPageHeader extends Component<AboutPageHeaderProps> {
    private titleView: ZeppWidget<ZeppTextWidgetOptions, {}> | null = null;
    private versionView: ZeppWidget<ZeppTextWidgetOptions, {}> | null = null;
    private iconView: ZeppWidget<ZeppImgWidgetOptions, {}> | null = null;

    protected onRender() {
        if(DEVICE_SHAPE == "band") return this.onRenderBand();
        if(!this.root || this.geometry.x == null || this.geometry.y == null || this.geometry.w == null || this.geometry.h == null)
            return;

        this.iconView = createWidget<ZeppImgWidgetOptions>(widget.IMG, {
            x: SCREEN_MARGIN + this.geometry.x,
            y: this.geometry.y,
            src: this.props.iconPath,
        });
        this.titleView = createWidget<ZeppTextWidgetOptions>(widget.TEXT, {
            x: SCREEN_MARGIN + this.geometry.x + 96,
            y: this.geometry.y,
            w: this.geometry.w - SCREEN_MARGIN - 88,
            color: 0xFFFFFF,
            text: this.props.name,
            text_style: text_style.NONE,
            text_size: this.root ? this.root.theme.FONT_SIZE : 18,
        })
        this.versionView = createWidget(widget.TEXT, {
            x: SCREEN_MARGIN + this.geometry.x + 96,
            y: this.geometry.y + this.root.theme.FONT_SIZE * 1.4,
            w: this.geometry.w - SCREEN_MARGIN - 88,
            color: 0xaaaaaa,
            text: this.props.version,
            text_style: text_style.NONE,
            text_size: this.root.theme.FONT_SIZE - 4,
        })
    }

    protected onRenderBand() {
        if(!this.root || this.geometry.x == null || this.geometry.y == null || this.geometry.w == null || this.geometry.h == null)
            return;

        this.iconView = createWidget<ZeppImgWidgetOptions>(widget.IMG, {
            x: this.geometry.x + Math.floor((this.geometry.w - 80) / 2),
            y: this.geometry.y,
            src: this.props.iconPath,
        });
        this.titleView = createWidget<ZeppTextWidgetOptions>(widget.TEXT, {
            x: 0,
            y: this.geometry.y + 96,
            w: this.geometry.w,
            color: 0xFFFFFF,
            text: this.props.name,
            align_h: align.CENTER_H,
            text_style: text_style.NONE,
            text_size: this.root.theme.FONT_SIZE,
        })
        this.versionView = createWidget(widget.TEXT, {
            x: 0,
            y: this.geometry.y + 96 + (this.root.theme.FONT_SIZE * 1.4),
            w: this.geometry.w,
            color: 0xaaaaaa,
            text: this.props.version,
            align_h: align.CENTER_H,
            text_style: text_style.NONE,
            text_size: this.root.theme.FONT_SIZE - 4,
        })
    }

    protected onDestroy() {
        deleteWidget(this.iconView);
        deleteWidget(this.titleView);
        deleteWidget(this.versionView);
    }

    protected getAutoHeight(): number {
        return DEVICE_SHAPE == "band" ? 160 : 112;
    }
}
