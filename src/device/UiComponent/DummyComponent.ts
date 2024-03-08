import { Component } from "./Component";

/**
 * Component that literally do nothing.
 */
export class DummyComponent extends Component<{height: number}> {
    protected onRender() {}
    protected onDestroy() {}
    protected onComponentUpdate() {}

    protected getAutoHeight(): number {
        return this.props.height;
    }
}
