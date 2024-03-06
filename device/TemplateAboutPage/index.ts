import {ListItem, ListView, SectionHeaderComponent} from "../UiListView";
import {Component} from "../UiComponent";
import {DEVICE_SHAPE, DeviceInfo} from "../UiProperties";

export class TemplateAboutPage extends ListView<null> {
    protected build(): Component<any>[] {
        return [];
    }

    protected buildMore(page: number): Promise<Component<any>[]> {
        let result: Component<any>[] = [];
        switch(page) {
            case 0:
                result = this.getDeviceInfo();
        }

        return Promise.resolve(result);
    }

    private getDeviceInfo() : Component<any>[] {
        return [
            new SectionHeaderComponent(this.i18n("This device:")),
            new ListItem({
                title: `${DeviceInfo.deviceName} (${DeviceInfo.deviceSource})`,
                description: this.i18n("Device model"),
            }),
            new ListItem({
                title: DEVICE_SHAPE,
                description: this.i18n("Device shape")
            })
        ]
    }

    protected i18n(sourceString: string) {
        return sourceString;
    }
}
