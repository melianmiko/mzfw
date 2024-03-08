import { PaperComponent } from "../UiPaperComponent";
import { IHmUIWidget, IHmUIWidgetOptions, systemUi } from "../System";
import { TextLayoutProvider } from "../SystemTools";
import { ListEntryWidgetProps } from "./Types";
import { ensureIsNotBand7, ICON_OFFSET, ICON_OFFSET_AFTER_MPX, ICON_SIZE, IS_MI_BAND_7 } from "../UiProperties";
import { DESCRIPTION_SIZE_DELTA, VERT_MARGIN } from "./ListItemSizes";

export class ListItem extends PaperComponent<ListEntryWidgetProps> {
    private textBoxWidth: number;
    private iconView: IHmUIWidget;
    private titleView: IHmUIWidget;
    private descriptionView: IHmUIWidget;
    private titleLayout = new TextLayoutProvider();
    private descriptionLayout = new TextLayoutProvider();

    protected colorDefault: number = IS_MI_BAND_7 ? 0x101010 : 0;

    onInit() {
        this.props = {
            onClick(): any {},
            onLongClick(): any {},
            textColor: 0xFFFFFF,
            descriptionColor: 0x999999,

            // Mi Band 7 system-like UI settings
            paperBackgroundMarginV: IS_MI_BAND_7 ? 2 : 0,
            paperRadius: IS_MI_BAND_7 ? 12 : 8,

            ...this.props,
        }
    }

    onRender() {
        super.onRender();

        this.iconView = this.group.createWidget(systemUi.widget.IMG, this.iconViewProps);
        this.titleView = this.group.createWidget(systemUi.widget.TEXT, this.titleViewProps);
        this.descriptionView = this.group.createWidget(systemUi.widget.TEXT, this.descriptionViewProps);
        this.setupEventsAt(this.iconView);
        this.setupEventsAt(this.titleView);
        this.setupEventsAt(this.descriptionView);
    }

    onDestroy() {
        ensureIsNotBand7();

        systemUi.deleteWidget(this.iconView);
        systemUi.deleteWidget(this.titleView);
        systemUi.deleteWidget(this.descriptionView);
        super.onDestroy();
    }

    get iconViewProps(): IHmUIWidgetOptions {
        return {
            x: ICON_OFFSET,
            y: this.props.description ? VERT_MARGIN : Math.floor((this.geometry.h - ICON_SIZE) / 2),
            w: ICON_SIZE,
            h: ICON_SIZE,
            src: `icon/${ICON_SIZE}/${this.props.icon}.png`,
        };
    }

    protected onPropertiesChange() {
        let width = this.geometry.w - ICON_OFFSET * 2;
        if(this.props.icon) width = width - ICON_SIZE - (ICON_OFFSET * ICON_OFFSET_AFTER_MPX);
        this.textBoxWidth = width;
        // console.log("textBoxWidth", width);

        // Text metrics
        this.titleLayout.performUpdate(this.props.title, this.textBoxWidth,
            this.root.theme.FONT_SIZE);
        this.descriptionLayout.performUpdate(this.props.description, this.textBoxWidth,
            this.root.theme.FONT_SIZE - DESCRIPTION_SIZE_DELTA);
        // console.log("Sizes for AH updated");
    }

    getAutoHeight(): number {
        // console.log("listItemAH", this.titleLayout.height, this.descriptionLayout.height);
        const textBasedHeight = this.titleLayout.height + this.descriptionLayout.height;
        return Math.max(textBasedHeight, ICON_SIZE) + (VERT_MARGIN * 2)
    }

    onComponentUpdate() {
        super.onComponentUpdate();
        this.iconView.setProperty(systemUi.prop.MORE, this.iconViewProps as any);
        this.titleView.setProperty(systemUi.prop.MORE, this.titleViewProps as any);
        this.descriptionView.setProperty(systemUi.prop.MORE, this.descriptionViewProps as any);
    }

    get titleViewProps(): IHmUIWidgetOptions {
        const textBasedHeight = this.titleLayout.height + this.descriptionLayout.height;
        return {
            x: typeof this.props.icon == "string" ? ICON_OFFSET * (1 + ICON_OFFSET_AFTER_MPX) + ICON_SIZE : ICON_OFFSET,
            y: Math.round((this.geometry.h - textBasedHeight) / 2),
            w: this.textBoxWidth,
            h: this.titleLayout.height,
            text_size: this.root.theme.FONT_SIZE,
            color: this.props.textColor,
            text_style: systemUi.text_style.WRAP,
            text: this.props.title,
        };
    }

    get descriptionViewProps(): IHmUIWidgetOptions {
        const textBasedHeight = this.titleLayout.height + this.descriptionLayout.height;
        return {
            x: typeof this.props.icon == "string" ? ICON_OFFSET * (1 + ICON_OFFSET_AFTER_MPX) + ICON_SIZE : ICON_OFFSET,
            y: Math.round((this.geometry.h - textBasedHeight) / 2) + this.titleLayout.height,
            w: this.textBoxWidth,
            h: this.descriptionLayout.height,
            text_size: this.root.theme.FONT_SIZE - DESCRIPTION_SIZE_DELTA,
            color: this.props.descriptionColor,
            text_style: systemUi.text_style.WRAP,
            text: this.props.description,
        };
    }

    onClick() {
        this.props.onClick();
    }

    onLongClick() {
        this.props.onLongClick();
    }
}
