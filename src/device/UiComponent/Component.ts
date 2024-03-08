import {RootComponent} from "./RootComponent";
import {IHmUIWidget, systemUi} from "../System";
import * as Interaction from "../System/Interaction";
import {ComponentGeometry, TouchEventData} from "./Types";


/**
 * Generic component class.
 */
export abstract class Component<P> {
    /**
     * Will be true if `geometry.h` initially was set to null.
     * True value mean that size may be changed after properties update.
     */
    private autoHeightEnabled: boolean = false;
    /**
     * Properties given to component until defining
     */
    protected props: P;
    /**
     * Root component
     */
    protected root: RootComponent<any> = null;
    /**
     * Is render performed
     */
    public isRendered: boolean = false;
    /**
     * Can this component receive wheel focus?
     */
    public isFocusable: boolean = false;
    /**
     * Component geometry data
     * @protected
     */
    public geometry: ComponentGeometry = {x: 0, y: 0, w: 100, h: 100};

    /**
     * Generic constructor
     *
     * @param props Properties
     */
    constructor(props: P) {
        this.props = props;
    }

    /**
     * This function will attach parent (root) component to current one, and
     * perform initial configuration.
     *
     * @param parent Root component to use
     */
    attachParent(parent: RootComponent<any>) {
        this.root = parent;
        this.onInit();
        this.onPropertiesChange();
    }

    /**
     * Update some properties and request widget to rebuild.
     * @param newProps Partial props to perform update
     */
    updateProps(newProps: Partial<P>) {
        // console.log('updateProps', JSON.stringify(newProps));
        const lastHeight = this.geometry.h;
        this.props = {...this.props, ...newProps};
        this.onPropertiesChange();

        if(this.autoHeightEnabled) {
            const newHeight = this.getAutoHeight();
            if(newHeight != lastHeight) {
                this.geometry.h = newHeight;
                this.root.onChildHeightChanged(this);
            }
        }

        if(this.isRendered)
            this.onComponentUpdate();
    }

    /**
     * This method will update current geometry of component.
     * Height can be null, which mean that it should be auto-calculated.
     *
     * This method should return actual geometry of component
     *
     * @return Actual geometry
     * @param x X position, if null - will skip position change
     * @param y Y position, should exist if x isn't null
     * @param w Component width, if null - will skip size change
     * @param h Component height, if null - will enable auto-height
     */
    public setGeometry(x: number = null, y: number = null, w: number = null, h: number = null) {
        // console.log('setGeometry', x, y, w, h);
        if(x != null) {
            this.geometry.x = x;
            this.geometry.y = y;
        }

        if(w != null) {
            this.geometry.w = w;
            this.geometry.h = h;
            this.autoHeightEnabled = h == null;
        }

        this.onGeometryChange();

        if(w != null && this.autoHeightEnabled) {
            let lastH = this.geometry.h;
            this.geometry.h = this.getAutoHeight();
            if(this.isRendered && lastH != this.geometry.h) {
                this.onGeometryChange();
                this.root.onChildHeightChanged(this);
            }
        }

        if(this.isRendered)
            this.onComponentUpdate();
    }

    /**
     * This method will delete component from scene
     */
    performDestroy() {
        if(!this.isRendered) return;
        this.onDestroy();
        this.isRendered = false;
    }

    /**
     * THis method will render current component to make it visible to user
     */
    performRender() {
        if(this.isRendered) return;
        this.onRender();
        this.isRendered = true;
    }

    /**
     * Add listeners for onTouchDown/Up/Move to native widget
     */
    protected setupEventsAt(nativeWidget: IHmUIWidget) {
        nativeWidget.addEventListener(systemUi.event.CLICK_DOWN, (p) => this.onTouchDown(p));
        nativeWidget.addEventListener(systemUi.event.CLICK_UP, (p) => this.onTouchUp(p));
        // noinspection JSUnresolvedReference
        nativeWidget.addEventListener((systemUi.event as any).MOVE, (p) => this.onTouchMove(p));
    }

    /**
     * Will be called when component props are changed.
     * Should perform required internal recalculations
     */
    protected onPropertiesChange() {}
    protected onGeometryChange() {
        // console.log("fallback onGeom -> onProp")
        this.onPropertiesChange(); // fallback
    }

    /**
     * Will be called after component constructor.
     */
    onInit(): void {};

    /**
     * Should update native UI view's
     */
    protected onComponentUpdate() {
        this.performDestroy();
        this.performRender();
    }

    /**
     * Will be called when component get focus from keyboard
     * navigation or wheel.
     */
    onFocus(): void {};

    /**
     * Will be called when component lose focus from keyboard
     * navigation or wheel.
     */
    onBlur(): void {};

    /**
     * Handle wheel selection button event. Is down-casted from parent component
     */
    onWheelButtonEvent(action: number) : boolean{
        if(action == Interaction.KEY_EVENT_CLICK)
            return this.onWheelClick();
        return false;
    }

    /**
     * Your component should call this at CLICK_DOWN.
     * @param data x,y
     */
    onTouchDown(data: TouchEventData): boolean {
        if(this.root == null) return false;
        return this.root.onTouchDown(data);
    }

    /**
     * Your component should call this at CLICK_UP.
     * @param data x,y
     */
    onTouchUp(data: TouchEventData): boolean {
        if(this.root == null) return false;
        return this.root.onTouchUp(data);
    }

    /**
     * Your component should call this at CLICK_MOVE,
     * @param data x,y
     */
    onTouchMove(data: TouchEventData): boolean {
        if(this.root == null) return false;
        return this.root.onTouchMove(data);
    }

    /**
     * Handle wheel click event.
     * Return true if handled
     */
    onWheelClick(): boolean {
        return false;
    }

    /**
     * Will be called on wheel spin.
     *
     * Return true, if you have handled this event to stop parent handlers.
     * Or return false, if you don't want to handle it.
     *
     * @param degree
     */
    onWheelSpin(degree: number): boolean {
        return false;
    }

    /**
     * Will be called when component should appear on screen.
     */
    protected abstract onRender(): any;

    /**
     * Will be called when component should be removed from screen
     * */
    protected abstract onDestroy() : any;

    /**
     * Should return auto-calculated component height
     */
    protected abstract getAutoHeight(): number;
}
