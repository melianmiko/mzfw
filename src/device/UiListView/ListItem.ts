import { PaperComponent } from "../UiPaperComponent";
import { TextLayoutProvider } from "../System/TextLayoutProvider";
import { ListItemProps } from "./Types";
import { ensureIsNotBand7, ICON_OFFSET, ICON_OFFSET_AFTER_MPX, ICON_SIZE, IS_MI_BAND_7 } from "../UiProperties";
import { DESCRIPTION_SIZE_DELTA, VERT_MARGIN } from "./ListItemSizes";
import { ZeppWidget } from "../../zosx/ui/Types";
import { ZeppImgWidgetOptions, ZeppTextWidgetOptions } from "../../zosx/ui/WidgetOptionTypes";
import { deleteWidget, prop, text_style, widget } from "../../zosx/ui";

export class ListItem extends PaperComponent<ListItemProps> {
    private textBoxWidth: number = 0;
    private iconView: ZeppWidget<ZeppImgWidgetOptions, {}> | null = null;
    private titleView: ZeppWidget<ZeppTextWidgetOptions, {}> | null = null;
    private descriptionView: ZeppWidget<ZeppTextWidgetOptions, {}> | null = null;
    private titleLayout = new TextLayoutProvider();
    private descriptionLayout = new TextLayoutProvider();
    private iconAtRight: boolean = false;
    private textOffsetLeft: number = 0;

    protected colorDefault: number = IS_MI_BAND_7 ? 0x101010 : 0;

    onInit() {
        if(!this.root) throw new Error("No compositor");

        this.props = {
            onClick(): any {},
            titleColor: this.root.theme.TEXT_COLOR,
            descriptionColor: this.root.theme.TEXT_COLOR_2,

            // Mi Band 7 system-like UI settings
            paperBackgroundMarginV: IS_MI_BAND_7 ? 2 : 0,
            paperRadius: IS_MI_BAND_7 ? 12 : 8,

            ...this.props,
        }
    }

    onRender() {
        super.onRender();
        if(!this.group) return;
        this.iconView = this.group.createWidget<ZeppImgWidgetOptions>(widget.IMG, this.iconViewProps);
        this.titleView = this.group.createWidget<ZeppTextWidgetOptions>(widget.TEXT, this.titleViewProps);
        this.descriptionView = this.group.createWidget<ZeppTextWidgetOptions>(widget.TEXT, this.descriptionViewProps);
        this.setupEventsAt(this.iconView);
        this.setupEventsAt(this.titleView);
        this.setupEventsAt(this.descriptionView);
    }

    onDestroy() {
        ensureIsNotBand7();

        deleteWidget(this.iconView);
        deleteWidget(this.titleView);
        deleteWidget(this.descriptionView);
        super.onDestroy();
    }

    protected onPropertiesChange() {
        super.onPropertiesChange();
        let width = (this.geometry.w ?? 0) - ICON_OFFSET * 2;
        if(this.props.icon) width = width - ICON_SIZE - (ICON_OFFSET * ICON_OFFSET_AFTER_MPX);
        this.textBoxWidth = width;
        this.iconAtRight = this.props.iconPosition == "right";

        const iconBoxSize = this.props.icon ? (ICON_OFFSET * ICON_OFFSET_AFTER_MPX) + ICON_SIZE : 0;
        this.textOffsetLeft = ICON_OFFSET + (this.iconAtRight ? 0 : iconBoxSize);

        // Text metrics
        this.titleLayout.performUpdate(this.props.title ?? "", this.textBoxWidth,
            this.root?.theme.FONT_SIZE ?? 18);
        this.descriptionLayout.performUpdate(this.props.description ?? "", this.textBoxWidth,
            (this.root?.theme.FONT_SIZE ?? 18) - DESCRIPTION_SIZE_DELTA);
    }

    getAutoHeight(): number {
        // console.log("listItemAH", this.titleLayout.height, this.descriptionLayout.height);
        const textBasedHeight = this.titleLayout.height + this.descriptionLayout.height;
        return Math.max(textBasedHeight, ICON_SIZE) + (VERT_MARGIN * 2)
    }

    onComponentUpdate() {
        super.onComponentUpdate();
        if(this.iconView) this.iconView.setProperty(prop.MORE, this.iconViewProps);
        if(this.titleView) this.titleView.setProperty(prop.MORE, this.titleViewProps);
        if(this.descriptionView) this.descriptionView.setProperty(prop.MORE, this.descriptionViewProps);
    }

    get iconViewProps(): ZeppImgWidgetOptions {
        return {
            x: this.iconAtRight ? (this.geometry.w ?? 0) - ICON_SIZE - ICON_OFFSET : ICON_OFFSET,
            y: this.props.description ? VERT_MARGIN : Math.floor(((this.geometry.h ?? 0) - ICON_SIZE) / 2),
            w: ICON_SIZE,
            h: ICON_SIZE,
            src: `icon/${ICON_SIZE}/${this.props.icon}.png`,
        };
    }

    get titleViewProps(): ZeppTextWidgetOptions {
        const textBasedHeight = this.titleLayout.height + this.descriptionLayout.height;
        return {
            x: this.textOffsetLeft,
            y: Math.round(((this.geometry.h ?? 0) - textBasedHeight) / 2),
            w: this.textBoxWidth,
            h: this.titleLayout.height,
            text_size: this.root ? this.root.theme.FONT_SIZE : 18,
            color: this.props.titleColor,
            text_style: text_style.WRAP,
            text: this.props.title ?? "",
        };
    }

    get descriptionViewProps(): ZeppTextWidgetOptions {
        const textBasedHeight = this.titleLayout.height + this.descriptionLayout.height;
        return {
            x: this.textOffsetLeft,
            y: Math.round(((this.geometry.h ?? 0) - textBasedHeight) / 2) + this.titleLayout.height,
            w: this.textBoxWidth,
            h: this.descriptionLayout.height,
            text_size: (this.root ? this.root.theme.FONT_SIZE : 18) - DESCRIPTION_SIZE_DELTA,
            color: this.props.descriptionColor,
            text_style: text_style.WRAP,
            text: this.props.description ?? "",
        };
    }

    onClick() {
        this.props.onClick && this.props.onClick();
    }
}
