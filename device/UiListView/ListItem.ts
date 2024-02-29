import {PaperComponent} from "../UiPaperComponent";
import {IHmUIWidget, IHmUIWidgetOptions, systemUi} from "../System";
import {TextLayoutProvider} from "../SystemTools";
import {ListEntryWidgetProps} from "./Types";
import {DEVICE_SHAPE} from "../UiProperties/UiProperties";

const ICON_SIZE = DEVICE_SHAPE == "band" ? 24 : 48;
const ICON_OFFSET = DEVICE_SHAPE == "band" ? 16 : 8;
const DESCRIPTION_SIZE_DELTA = 2;
const VERT_MARGIN = 16;


export class ListItem extends PaperComponent<ListEntryWidgetProps> {
    private textBoxWidth: number;
    private iconView: IHmUIWidget;
    private titleView: IHmUIWidget;
    private descriptionView: IHmUIWidget;
    private titleLayout = new TextLayoutProvider();
    private descriptionLayout = new TextLayoutProvider();

    onInit() {
        this.props = {
            onClick(): any {},
            onLongClick(): any {},
            textColor: 0xFFFFFF,
            descriptionColor: 0x999999,
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
        systemUi.deleteWidget(this.iconView);
        systemUi.deleteWidget(this.titleView);
        systemUi.deleteWidget(this.descriptionView);
        super.onDestroy();
    }

    get iconViewProps(): IHmUIWidgetOptions {
        return {
            x: ICON_OFFSET,
            y: VERT_MARGIN,
            w: ICON_SIZE,
            h: ICON_SIZE,
            src: `icon/${ICON_SIZE}/${this.props.icon}.png`,
        };
    }

    protected onPropertiesOrGeometryChange() {
        // Base box width
        let width = this.geometry.w - ICON_OFFSET * 2;
        if(this.props.icon) width = width - ICON_SIZE - (ICON_OFFSET * 2);
        this.textBoxWidth = width;

        // Text metrics
        this.titleLayout.performUpdate(this.props.title, this.textBoxWidth,
            this.root.baseFontSize)
        this.descriptionLayout.performUpdate(this.props.description, this.textBoxWidth,
            this.root.baseFontSize - DESCRIPTION_SIZE_DELTA)
    }

    getAutoHeight(): number {
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
            x: typeof this.props.icon == "string" ? ICON_OFFSET * 3 + ICON_SIZE : ICON_OFFSET,
            y: Math.round((this.geometry.h - textBasedHeight) / 2),
            w: this.textBoxWidth,
            h: this.titleLayout.height,
            text_size: this.root.baseFontSize,
            color: this.props.textColor,
            text_style: systemUi.text_style.WRAP,
            text: this.props.title,
        };
    }

    get descriptionViewProps(): IHmUIWidgetOptions {
        const textBasedHeight = this.titleLayout.height + this.descriptionLayout.height;
        return {
            x: typeof this.props.icon == "string" ? ICON_OFFSET * 3 + ICON_SIZE : ICON_OFFSET,
            y: Math.round((this.geometry.h - textBasedHeight) / 2) + this.titleLayout.height,
            w: this.textBoxWidth,
            h: this.descriptionLayout.height,
            text_size: this.root.baseFontSize - DESCRIPTION_SIZE_DELTA,
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
