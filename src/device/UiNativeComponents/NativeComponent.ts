import { Component } from "../UiComponent";
import { ZeppWidget, ZeppWidgetID } from "../../zosx/ui/Types";
import { ZeppWidgetGenericOptions } from "../../zosx/ui/WidgetOptionTypes";
import { createWidget, deleteWidget, prop } from "../../zosx/ui";

export abstract class NativeComponent<AP, NP, WTE = {}> extends Component<AP> {
    protected abstract widgetID: ZeppWidgetID;
    protected abstract defaultProps: Partial<AP>;
    protected abstract nativeProps: ZeppWidgetGenericOptions & NP;
    protected widget: ZeppWidget<ZeppWidgetGenericOptions & NP, WTE> | null = null;

    onInit() {
        this.props = {
            ...this.defaultProps,
            ...this.props,
        }
        super.onInit();
    }

    protected onRender() {
        this.widget = createWidget<ZeppWidgetGenericOptions & NP, WTE>(this.widgetID, this.nativeProps);
        this.setupEventsAt(this.widget);
    }

    protected onDestroy(): any {
        deleteWidget(this.widget)
    }

    protected onPropertiesChange() {
        this.updateProperties();
    }

    protected onGeometryChange() {
        this.updateGeometry();
    }

    protected onComponentUpdate() {
        if(this.widget)
            this.widget.setProperty(prop.MORE, this.nativeProps);
    }

    /**
     * In this method you should update native props in `this.nativeProps` via
     * provided AcceptedProps
     *
     * @protected
     */
    protected abstract updateProperties(): void;
    protected abstract updateGeometry(): void;
}
