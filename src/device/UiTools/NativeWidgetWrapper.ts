import { ZeppGroupInstance, ZeppWidget, ZeppWidgetID } from "../../zosx/ui/Types";
import { createWidget, deleteWidget, prop } from "../../zosx/ui";
import { IS_BAND_7, ZeppNotSupportedError } from "../UiProperties";

export abstract class NativeWidgetWrapper<WP, WO> {
    protected abstract widgetId: ZeppWidgetID;
    protected abstract props: WP;
    protected widget: ZeppWidget<WP, WO> | null = null;
    protected group: ZeppGroupInstance | null = null;
    protected allowDestroyOnBand7: boolean = true;
    protected shouldExist: boolean = true;

    onRender(): void {
        if(this.shouldExist && !this.widget) {
            this.widget = this.group?.createWidget(this.widgetId, this.props) ?? createWidget<WP, WO>(this.widgetId, this.props);
        }
    }

    onDestroy(): void {
        if(!this.allowDestroyOnBand7 && IS_BAND_7)
            throw new ZeppNotSupportedError("This feature not supported on Band 7");
        if(this.widget) deleteWidget(this.widget);
    }

    onComponentUpdate(): void {
        if(this.widget && (this.shouldExist || ( IS_BAND_7 && !this.shouldExist))) {
            // update
            this.widget.setProperty(prop.MORE, this.props);
        } else if(this.widget && !this.shouldExist) {
            // delete
            this.onDestroy();
        } else if(!this.widget && this.shouldExist) {
            // create
            this.onRender();
        }
    }
}
