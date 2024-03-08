import { ListItem, ListView, SectionHeaderComponent } from "../UiListView";
import { MZFW_VERSION } from "../../shared/info";
import { Component } from "../UiComponent";
import { AboutPageHeader } from "./AboutPageHeader";
import {
    DEVICE_SHAPE,
    DeviceInfo,
    HAVE_STATUS_BAR,
    IS_BAND_7,
    IS_LOW_RAM_DEVICE,
    IS_MI_BAND_7,
    IS_SMALL_SCREEN_DEVICE
} from "../UiProperties";
import { zeppFeatureLevel } from "../System";

export abstract class TemplateAboutPage extends ListView<null> {
    /**
     * Place your app display name here
     * @protected
     */
    protected abstract displayName: string;
    protected abstract displayVersion: string;
    protected iconPath: string = "icon/80/icon.png";
    /**
     * Place your application developers list here
     * @protected
     */
    protected abstract authors: { [name: string]: string };
    /**
     * Extra build info to show. If you're using zeusx with enabled build constants,
     * set this to BUNDLE.
     * @protected
     */
    protected buildInfo: { [id: string]: any } = null;
    /**
     * List of used third party libraries and their versions.
     * Would be great if you'll keep mzfw and zeusx lines inside.
     *
     * @protected
     */
    protected thirdPartyLibraries: { [name: string]: string } = {
        mzfw: MZFW_VERSION.toString(),
    };

    /**
     * Override this to add custom items to about page.
     * @protected
     */
    protected extraItems(): Component<any>[] {
        return [];
    }

    protected build(): Component<any>[] {
        return [
            new AboutPageHeader({
                name: this.displayName,
                version: this.displayVersion,
                iconPath: this.iconPath,
            }),
            ...this.extraItems(),
            ...this.getAuthors(),
            ...this.getLibrariesInfo(),
            ...this.getNerdInfoRows(),
        ];
    }

    private getAuthors(): Component<any>[] {
        const out: Component<any>[] = [
            new SectionHeaderComponent("Authors")
        ];

        for (const name in this.authors)
            out.push(new ListItem({
                title: name,
                description: this.authors[name]
            }));

        return out;
    }

    private getLibrariesInfo(): Component<any>[] {
        const out: Component<any>[] = [
            new SectionHeaderComponent("Third-party libraries")
        ];

        for (const name in this.thirdPartyLibraries) {
            if (this.thirdPartyLibraries[name]) {
                out.push(new ListItem({
                    title: name,
                    description: this.thirdPartyLibraries[name]
                }));
            }
        }

        // Add builder version from buildInfo
        if (this.buildInfo && this.buildInfo.ZX_VERSION) {
            out.push(new ListItem({
                title: "zeusx",
                description: this.buildInfo.ZX_VERSION
            }));
        }

        return out;
    }

    private getNerdInfoRows(): Component<any>[] {
        const deviceInfo = new ListItem({
            title: "",
            description: this.i18n("Show device info"),
            onClick: () => {
                deviceInfo.updateProps({description: this.getDeviceInfo()});
            }
        });

        const buildInfo = this.buildInfo ? new ListItem({
            title: "",
            description: this.i18n("Show build info"),
            onClick: () => {
                let info = "Build info:";
                for (const key in this.buildInfo) {
                    info += "\n- " + key + ": " + JSON.stringify(this.buildInfo[key]);
                }
                buildInfo.updateProps({description: info});
            }
        }) : null;

        return [
            new SectionHeaderComponent(this.i18n("Additional info")),
            deviceInfo,
            buildInfo
        ];
    }

    private getDeviceInfo(): string {
        return `deviceName: ${DeviceInfo.deviceName}\n` +
            `deviceSource: ${DeviceInfo.deviceSource}\n` +
            `zeppFeatureLevel: ${zeppFeatureLevel}\n` +
            `DEVICE_SHAPE: ${DEVICE_SHAPE}\n` +
            `UI_FLAGS:\n` +
            (IS_BAND_7 ? "-IS_BAND_7\n" : "") +
            (IS_MI_BAND_7 ? "-IS_MI_BAND_7\m" : "") +
            (HAVE_STATUS_BAR ? "-HAVE_STATUS_BAR\n" : "") +
            (IS_LOW_RAM_DEVICE ? "-IS_LOW_RAM_DEVICE\n" : "") +
            (IS_SMALL_SCREEN_DEVICE ? "-IS_SMALL_SCREEN_DEVICE\n" : "");
    }

    protected i18n(sourceString: string) {
        return sourceString;
    }
}
