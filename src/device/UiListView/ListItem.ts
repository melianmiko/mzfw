import { PaperComponent } from "../UiPaperComponent";
import { TextLayoutProvider } from "../System/TextLayoutProvider";
import { ListItemInternalMetrics, ListItemProps } from "./Types";
import { ICON_OFFSET, ICON_OFFSET_AFTER_MPX, ICON_SIZE, IS_MI_BAND_7 } from "../UiProperties";
import { DESCRIPTION_SIZE_DELTA, VERT_MARGIN } from "./ListItemSizes";
import { ListItemTitleView } from "./ListItemParts/ListItemTitleView";
import { ListItemDescriptionView } from "./ListItemParts/ListItemDescriptionView";
import { ListItemIconView } from "./ListItemParts/ListItemIconView";

export class ListItem extends PaperComponent<ListItemProps> {
    protected colorDefault: number = IS_MI_BAND_7 ? 0x101010 : 0;

    private metrics: ListItemInternalMetrics = {
        textBasedHeight: 0,
        textBoxWidth: 0,
        textOffsetLeft: 0,
        titleLayout: new TextLayoutProvider(),
        descriptionLayout: new TextLayoutProvider(),
    }

    private readonly icon: ListItemIconView = new ListItemIconView();
    private readonly title: ListItemTitleView = new ListItemTitleView();
    private readonly description: ListItemDescriptionView = new ListItemDescriptionView();

    onInit() {
        if (!this.root) throw new Error("No compositor");

        this.props = {
            onClick(): any {
            },
            titleColor: this.root.theme.TEXT_COLOR,
            descriptionColor: this.root.theme.TEXT_COLOR_2,

            // Mi Band 7 system-like UI settings
            paperBackgroundMarginV: IS_MI_BAND_7 ? 2 : 0,
            paperRadius: IS_MI_BAND_7 ? 12 : 8,

            ...this.props,
        };
    }

    onRender() {
        super.onRender();
        if (!this.group) return;

        const setupEvents = this.setupEventsAt.bind(this);
        this.title.onViewRender(this.group, setupEvents);
        this.description.onViewRender(this.group, setupEvents);
        this.icon.onViewRender(this.group, setupEvents);
    }

    onDestroy() {
        this.description.onDestroy();
        this.title.onDestroy();
        this.icon.onDestroy();

        super.onDestroy();
    }

    protected onGeometryChange() {
        super.onGeometryChange();
        this.onPropertiesChange();
    }

    protected onPropertiesChange() {
        super.onPropertiesChange();

        let width = (this.geometry.w ?? 0) - ICON_OFFSET * 2;
        if (this.props.icon) width = width - ICON_SIZE - (ICON_OFFSET * ICON_OFFSET_AFTER_MPX);

        const iconBoxSize = this.props.icon ? (ICON_OFFSET * ICON_OFFSET_AFTER_MPX) + ICON_SIZE : 0;
        this.metrics.textBoxWidth = width;
        this.metrics.textOffsetLeft = ICON_OFFSET + (this.props.iconPosition == "right" ? 0 : iconBoxSize);

        this.metrics.titleLayout.performUpdate(this.props.title ?? "", this.metrics.textBoxWidth,
            this.root?.theme.FONT_SIZE ?? 18);
        this.metrics.descriptionLayout.performUpdate(this.props.description ?? "", this.metrics.textBoxWidth,
            (this.root?.theme.FONT_SIZE ?? 18) - DESCRIPTION_SIZE_DELTA);
        this.metrics.textBasedHeight = this.metrics.titleLayout.height + this.metrics.descriptionLayout.height;

        this.icon.onChange(this.props, this.geometry);
        this.title.onChange(this.props, this.geometry, this.root.theme, this.metrics);
        this.description.onChange(this.props, this.geometry, this.root.theme, this.metrics);
    }

    getAutoHeight(): number {
        return Math.max(this.metrics.textBasedHeight, ICON_SIZE) + (VERT_MARGIN * 2)
    }

    onComponentUpdate() {
        super.onComponentUpdate();
        this.icon.onComponentUpdate();
        this.title.onComponentUpdate();
        this.description.onComponentUpdate();
    }

    onClick() {
        this.props.onClick && this.props.onClick();
    }
}
