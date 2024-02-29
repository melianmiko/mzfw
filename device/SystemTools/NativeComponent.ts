import {IHmUIWidget, INativeWidgetParent, systemUi} from "../System";
import {Component, ComponentGeometry} from "../UiComponent";

export abstract class NativeComponent<AcceptedProps, NativeProps> extends Component<AcceptedProps> {
    protected abstract widgetID: number;
    protected abstract defaultProps: AcceptedProps;
    protected abstract nativeProps: NativeProps;
    protected widget: IHmUIWidget;

    onInit() {
        this.props = {
            ...this.defaultProps,
            ...this.props,
        }
        super.onInit();
    }

    protected onRender() {
        this.updateProperties();
        this.widget = systemUi.createWidget(this.widgetID, this.nativeProps as any);
    }

    protected onDestroy(): any {
        systemUi.deleteWidget(this.widget)
    }

    protected onPropertiesOrGeometryChange() {
        this.updateProperties();
    }

    protected onComponentUpdate() {
        this.widget.setProperty(systemUi.prop.MORE, this.props as any);
    }

    /**
     * In this method you should update native props in `this.nativeProps` via
     * provided AcceptedProps
     *
     * @protected
     */
    abstract updateProperties(): void;
}
