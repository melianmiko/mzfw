import {IHmUIWidget, systemUi} from "../System";
import {Component} from "../UiComponent";

export abstract class NativeComponent<AcceptedProps, NativeProps> extends Component<AcceptedProps> {
    protected abstract widgetID: number;
    protected abstract defaultProps: Partial<AcceptedProps>;
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
        // console.log(JSON.stringify(this.nativeProps));
        this.widget = systemUi.createWidget(this.widgetID, this.nativeProps as any);
        this.setupEventsAt(this.widget);
    }

    protected onDestroy(): any {
        systemUi.deleteWidget(this.widget)
    }

    protected onPropertiesChange() {
        this.updateProperties();
    }

    protected onGeometryChange() {
        this.updateGeometry();
    }

    protected onComponentUpdate() {
        this.widget.setProperty(systemUi.prop.MORE, this.nativeProps as any);
    }

    /**
     * In this method you should update native props in `this.nativeProps` via
     * provided AcceptedProps
     *
     * @protected
     */
    abstract updateProperties(): void;
    abstract updateGeometry(): void;
}
