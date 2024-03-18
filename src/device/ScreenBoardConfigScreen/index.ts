import { ListItem, ListView, SectionHeaderComponent } from "../UiListView";
import { Component } from "../UiComponent";
import { ConfigStorage } from "../Path";
import { IMAGE_SELECT_ICON_SIZE, ImageOptionBarProps, ImageOptionsBarItem, ImageSelectBar } from "../UiImageSelectBar";
import { SB_AVAILABLE_RENDERERS, SB_DEFAULT_RENDERER } from "../ScreenBoard/tools/ScreenBoardConstants";
import { SB_KNOWN_LAYOUTS } from "../ScreenBoard/tools/ScreenBoardCompiledData";
import { ICON_SIZE } from "../UiProperties";
import { getFallbackLayouts } from "../ScreenBoard/tools/ScreenBoardTools";

export class ScreenBoardConfigScreen extends ListView<any> {
    private readonly config: ConfigStorage = new ConfigStorage("mzfw_sb");
    private readonly renderPicker: ImageSelectBar = new ImageSelectBar({children: []});

    protected build(): (Component<any> | null)[] {
        this.renderPicker.updateProps(this.getRendererPickerProps());

        return [
            this.renderPicker,
            new SectionHeaderComponent(this.i18n("Layouts:")),
            ...(Object.entries(SB_KNOWN_LAYOUTS).map(([id, name]) => this.makeLayoutSwitch(id, name)))
        ];
    }

    private makeLayoutSwitch(id: string, name: string): ListItem {
        const item = new ListItem({
            title: this.i18n(name),
            description: id,
            icon: `/mzfw/${ICON_SIZE}/false.png`,
            onClick: (): void => {
                let layouts = this.currentLayouts();
                if(layouts.indexOf(id) > -1) {
                    // delete
                    if(layouts.length == 1) return;
                    layouts = layouts.filter((i) => i != id);
                } else {
                    // add
                    layouts.push(id);
                }
                this.config.setItem("layouts", layouts);
                refreshIcon();
            }
        });

        const refreshIcon = () => {
            const layouts = this.currentLayouts();
            item.updateProps({
                icon: layouts.indexOf(id) > -1 ? `/mzfw/${ICON_SIZE}/true.png` : `/mzfw/${ICON_SIZE}/false.png`,
            });
        }

        refreshIcon();
        return item;
    }

    private currentLayouts(): string[] {
        return this.config.getItem("layouts") ?? getFallbackLayouts(Object.keys(SB_KNOWN_LAYOUTS));
    }

    private getRendererPickerProps(): ImageOptionBarProps {
        const current: string = this.config.getItem("renderer") ?? SB_DEFAULT_RENDERER;
        const items: ImageOptionsBarItem[] = [];

        SB_AVAILABLE_RENDERERS.forEach((rendererName: string) => {
            items.push({
                icon: `/mzfw/${IMAGE_SELECT_ICON_SIZE}/sb_${rendererName}.png`,
                title: this.i18n(rendererName.toUpperCase()),
                active: current == rendererName,
                onClick: () => {
                    // console.log("Apply", rendererName)
                    this.config.setItem("renderer", rendererName);
                    this.renderPicker.updateProps(this.getRendererPickerProps());
                }
            });
        })

        return {
            children: items,
        }
    }

    i18n(key: string) {
        // Override this to bring multi-locale support
        return key;
    }
}
