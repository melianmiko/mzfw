import {IHmUIWidget, INativeWidgetParent, systemUi} from "../System";
import {ComponentGeometry} from "../UiComponent";

export abstract class NativeWidgetProvider<AcceptedProps, NativeProps> {
    protected abstract widgetID: number;

    private props: NativeProps;
    public widget: IHmUIWidget;

    create(parent: INativeWidgetParent = systemUi) {
        if(this.widget) return;
        this.widget = parent.createWidget(this.widgetID, this.props as any);
    }

    destroy() {
        if(!this.widget) return;
        systemUi.deleteWidget(this.widget)
    }

    updateView() {
        this.widget.setProperty(systemUi.prop.MORE, this.props as any);
    }

    /**
     * In this method you should update native props in `this.props` via
     * provided AcceptedProps
     *
     * @param props Accepted props
     * @param geometry Component geometry, provided by parent component
     * @protected
     */
    abstract updateProperties(props: AcceptedProps, geometry: ComponentGeometry): void;
}
