import { ListItem, ListView, SectionHeaderComponent } from "../UiListView";
import { Component } from "../UiComponent";
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

// Zeusx bundle
declare const BUNDLE: {
    APP_ID: number,
    APP_VERSION: string,
    ZX_VERSION: string,
    BUILD_TIME: number,
    TARGET: string,
    [custom: string]: any,
};


export class TemplateAboutPage extends ListView<null> {
    /**
     * Extra build info to show. If you're using zeusx with enabled build constants,
     * set this to BUNDLE.
     * @protected
     */
    protected buildInfo: {[id: string]: any} = null;
    /**
     * List of used third party libraries and their versions.
     * Would be great if you'll keep mzfw and zeusx lines inside.
     *
     * @protected
     */
    protected thirdPartyLibraries: {[name: string]: string} = {

    };

    protected build(): Component<any>[] {
        return [];
    }

    protected buildMore(page: number): Promise<Component<any>[]> {
        let result: Component<any>[] = [];
        switch(page) {
            case 0:
                result = this.getNerdInfoRows();
        }

        return Promise.resolve(result);
    }

    private getLibrariesInfo(): Component<any>[] {
        const out: Component<any>[] = [
            new SectionHeaderComponent("Third-party libraries")
        ]

        return out;
    }

    private getNerdInfoRows(): Component<any>[] {
        const deviceInfo = new ListItem({
            title: "",
            description: this.i18n("Show device info"),
            onClick: () =>{
                deviceInfo.updateProps({description: this.getDeviceInfo()});
            }
        });

        const buildInfo = this.buildInfo ? new ListItem({
            title: "",
            description: this.i18n("Show build info"),
            onClick: () => {
                let info = "ZEUSX_BUNDLE:";
                for(const key in this.buildInfo)
                    info += "\n- " + key + ": " + JSON.stringify(this.buildInfo[key]);
                buildInfo.updateProps({description: info});
            }
        }) : null;

        return [
            new SectionHeaderComponent(this.i18n("Additional info")),
            deviceInfo,
            buildInfo
        ];
    }

    private getDeviceInfo() : string {
        return `deviceName: ${DeviceInfo.deviceName}\n` +
            `deviceSource: ${DeviceInfo.deviceSource}\n` +
            `zeppFeatureLevel: ${zeppFeatureLevel}\n`+
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
